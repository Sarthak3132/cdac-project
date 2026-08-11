import asyncio
import json
import logging

import aio_pika
from aio_pika.abc import AbstractIncomingMessage

from config import settings
from groq_client import groq_client
from models import AiRequestMessage, AiRequestType, AiResultMessage

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")
logger = logging.getLogger("ai-worker")


async def handle_message(message: AbstractIncomingMessage, exchange: aio_pika.Exchange) -> None:
    async with message.process(requeue=False):
        try:
            request = AiRequestMessage.model_validate(json.loads(message.body))
        except Exception:
            logger.exception("Failed to parse AI request: %s", message.body)
            return

        logger.info("Processing %s for session %s", request.type, request.session_id)

        try:
            if request.type == AiRequestType.COMPLEXITY:
                if not request.source_code:
                    raise ValueError("sourceCode is required for COMPLEXITY requests")
                content = await groq_client.analyze_complexity(request.source_code, request.language)
            else:
                if not request.message:
                    raise ValueError("message is required for CHAT requests")
                history = [turn.model_dump() for turn in (request.history or [])]
                content = await groq_client.chat(
                    request.message,
                    history,
                    problem_title=request.problem_title,
                    problem_description=request.problem_description,
                    source_code=request.source_code,
                    language=request.language,
                )
            result = AiResultMessage(sessionId=request.session_id, type=request.type, content=content)
        except Exception as exc:
            logger.exception("AI processing failed for session %s", request.session_id)
            result = AiResultMessage(sessionId=request.session_id, type=request.type, error=str(exc))

        await exchange.publish(
            aio_pika.Message(
                body=result.model_dump_json(by_alias=True).encode(),
                content_type="application/json",
                delivery_mode=aio_pika.DeliveryMode.PERSISTENT,
            ),
            routing_key=settings.ai_result_queue,
        )


async def main() -> None:
    connection = await aio_pika.connect_robust(settings.rabbitmq_url)
    try:
        async with connection:
            channel = await connection.channel()
            await channel.set_qos(prefetch_count=settings.prefetch_count)

            exchange = await channel.declare_exchange(
                settings.exchange_name, aio_pika.ExchangeType.TOPIC, durable=True
            )
            request_queue = await channel.declare_queue(settings.ai_request_queue, durable=True)
            await request_queue.bind(exchange, routing_key=settings.ai_request_queue)
            result_queue = await channel.declare_queue(settings.ai_result_queue, durable=True)
            await result_queue.bind(exchange, routing_key=settings.ai_result_queue)

            logger.info("AI worker listening on '%s'", settings.ai_request_queue)

            async with request_queue.iterator() as queue_iter:
                async for message in queue_iter:
                    asyncio.create_task(handle_message(message, exchange))
    finally:
        await groq_client.close()


if __name__ == "__main__":
    asyncio.run(main())