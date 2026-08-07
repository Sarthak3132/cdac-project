package com.codeplatform.backend.config;


import org.springframework.amqp.core.Binding;
import org.springframework.amqp.core.BindingBuilder;
import org.springframework.amqp.core.Queue;
import org.springframework.amqp.core.QueueBuilder;
import org.springframework.amqp.core.TopicExchange;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class RabbitMQConfig {

    public static final String EXCHANGE = "worker.exchange";

    // Request queues (Backend -> Workers)
    public static final String CODE_RUN_QUEUE = "code.run.queue";
    public static final String PROBLEM_RUN_QUEUE = "problem.run.queue";
    public static final String SUBMISSION_QUEUE = "problem.submit.queue";

    // Result queues (Workers -> Backend)
    public static final String CODE_RESULT_QUEUE = "code.result.queue";
    public static final String PROBLEM_RESULT_QUEUE = "problem.result.run.queue";
    public static final String SUBMISSION_RESULT_QUEUE = "problem.submit.result.queue";

    @Bean
    public TopicExchange compilerExchange() {
        return new TopicExchange(EXCHANGE, true, false);
    }

    // ---- Request queues ----
    @Bean
    public Queue codeRunQueue() {
        return QueueBuilder.durable(CODE_RUN_QUEUE).build();
    }

    @Bean
    public Queue exampleRunQueue() {
        return QueueBuilder.durable(PROBLEM_RUN_QUEUE).build();
    }

    @Bean
    public Queue submissionQueue() {
        return QueueBuilder.durable(SUBMISSION_QUEUE).build();
    }

    // ---- Result queues ----
    @Bean
    public Queue codeResultQueue() {
        return QueueBuilder.durable(CODE_RESULT_QUEUE).build();
    }

    @Bean
    public Queue exampleResultQueue() {
        return QueueBuilder.durable(PROBLEM_RESULT_QUEUE).build();
    }

    @Bean
    public Queue submissionResultQueue() {
        return QueueBuilder.durable(SUBMISSION_RESULT_QUEUE).build();
    }

    // ---- Bindings (routing key == queue name, topic exchange) ----
    @Bean
    public Binding codeRunBinding(Queue codeRunQueue, TopicExchange compilerExchange) {
        return BindingBuilder.bind(codeRunQueue).to(compilerExchange).with(CODE_RUN_QUEUE);
    }

    @Bean
    public Binding exampleRunBinding(Queue exampleRunQueue, TopicExchange compilerExchange) {
        return BindingBuilder.bind(exampleRunQueue).to(compilerExchange).with(PROBLEM_RUN_QUEUE);
    }

    @Bean
    public Binding submissionBinding(Queue submissionQueue, TopicExchange compilerExchange) {
        return BindingBuilder.bind(submissionQueue).to(compilerExchange).with(SUBMISSION_QUEUE);
    }

    @Bean
    public Binding codeResultBinding(Queue codeResultQueue, TopicExchange compilerExchange) {
        return BindingBuilder.bind(codeResultQueue).to(compilerExchange).with(CODE_RESULT_QUEUE);
    }

    @Bean
    public Binding exampleResultBinding(Queue exampleResultQueue, TopicExchange compilerExchange) {
        return BindingBuilder.bind(exampleResultQueue).to(compilerExchange).with(PROBLEM_RESULT_QUEUE);
    }

    @Bean
    public Binding submissionResultBinding(Queue submissionResultQueue, TopicExchange compilerExchange) {
        return BindingBuilder.bind(submissionResultQueue).to(compilerExchange).with(SUBMISSION_RESULT_QUEUE);
    }

    // JSON message conversion instead of default Java serialization
    @Bean
    public MessageConverter jsonMessageConverter() {
        return new Jackson2JsonMessageConverter();
    }

    @Bean
    public RabbitTemplate rabbitTemplate(ConnectionFactory connectionFactory, MessageConverter converter) {
        RabbitTemplate template = new RabbitTemplate(connectionFactory);
        template.setMessageConverter(converter);
        return template;
    }
}