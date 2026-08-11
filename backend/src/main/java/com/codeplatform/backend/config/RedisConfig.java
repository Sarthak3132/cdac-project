package com.codeplatform.backend.config;

import io.lettuce.core.ClientOptions;
import io.lettuce.core.SocketOptions;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.redis.connection.RedisStandaloneConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceClientConfiguration;
import org.springframework.data.redis.connection.lettuce.LettuceConnectionFactory;
import org.springframework.data.redis.core.RedisTemplate;
import org.springframework.data.redis.serializer.StringRedisSerializer;

import java.time.Duration;

@Slf4j
@Configuration
public class RedisConfig {

    @Value("${REDIS_HOST}")
    private String redisHost;

    @Value("${REDIS_PORT:6379}")
    private int redisPort;

    @Value("${REDIS_USERNAME}")
    private String redisUsername;

    @Value("${REDIS_PASSWORD}")
    private String redisPassword;

    @Value("${REDIS_SSL_ENABLED:false}")
    private boolean sslEnabled;

    private LettuceConnectionFactory connectionFactory;

    @Bean
    public LettuceConnectionFactory redisConnectionFactory() {
        RedisStandaloneConfiguration standaloneConfig = new RedisStandaloneConfiguration();
        standaloneConfig.setHostName(redisHost);
        standaloneConfig.setPort(redisPort);
        standaloneConfig.setUsername(redisUsername);
        standaloneConfig.setPassword(redisPassword);

        SocketOptions socketOptions = SocketOptions.builder()
                .connectTimeout(Duration.ofMillis(2000))
                .keepAlive(true)
                .build();

        ClientOptions clientOptions = ClientOptions.builder()
                .socketOptions(socketOptions)
                .autoReconnect(true)
                .build();

        LettuceClientConfiguration.LettuceClientConfigurationBuilder clientConfigBuilder =
                LettuceClientConfiguration.builder()
                        .commandTimeout(Duration.ofMillis(1000))
                        .clientOptions(clientOptions);

        if (sslEnabled) {
            clientConfigBuilder.useSsl();
        }

        connectionFactory = new LettuceConnectionFactory(standaloneConfig, clientConfigBuilder.build());
        connectionFactory.afterPropertiesSet();

        checkConnection();

        return connectionFactory;
    }

    @Bean
    public RedisTemplate<String, String> redisTemplate(LettuceConnectionFactory redisConnectionFactory) {
        RedisTemplate<String, String> template = new RedisTemplate<>();
        template.setConnectionFactory(redisConnectionFactory);
        template.setKeySerializer(new StringRedisSerializer());
        template.setValueSerializer(new StringRedisSerializer());
        template.afterPropertiesSet();
        return template;
    }

    private void checkConnection() {
        try {
            String pong = connectionFactory.getConnection().ping();
            log.info("Redis connected successfully [{}:{}] -> PING response: {}", redisHost, redisPort, pong);
        } catch (Exception ex) {
            log.error("Redis connection FAILED [{}:{}] -> {}. App will still start; rate limiting will fail open.",
                    redisHost, redisPort, ex.getMessage());
        }
    }
}