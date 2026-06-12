# Food Delivery Backend Microservices

This backend scaffold provides a Spring Boot microservices architecture for the existing frontend.

Services included:

- `config-server` - Spring Cloud Config Server for centralized application configuration.
- `discovery-server` - Eureka registry for service discovery.
- `api-gateway` - Spring Cloud Gateway for routing and centralized ingress.
- `auth-service` - Authentication, user registration, and profile management.
- `restaurant-service` - Restaurant catalog and discovery.
- `menu-service` - Menu item catalog and restaurant menu filtering.
- `cart-service` - Kafka-backed cart management with event publishing for cart updates.
- `order-service` - Order persistence, status tracking, and fulfillment orchestration.
- `payment-service` - Stripe integration for payment intent creation.

## Tracing and Logging

- Each service uses Spring Cloud Sleuth for distributed tracing.
- Log patterns include `traceId` and `spanId` for end-to-end correlation.
- Kafka cart events preserve traceflow across cart operations.

## Required tools

- Java 21
- Maven
- Kafka + Zookeeper (or managed Kafka)
- Stripe account with secret key

## Configuration

Each service reads configuration from the Config Server at `http://localhost:8888`.
Set the Stripe key for the payment service via:

```bash
export STRIPE_SECRET_KEY=sk_test_...
```

## Run order

1. Start Zookeeper and Kafka.
2. Start Config Server:
   ```bash
   mvn -f backend/config-server spring-boot:run
   ```
3. Start Discovery Server:
   ```bash
   mvn -f backend/discovery-server spring-boot:run
   ```
4. Start API Gateway:
   ```bash
   mvn -f backend/api-gateway spring-boot:run
   ```
5. Start services one by one:
   ```bash
   mvn -f backend/auth-service spring-boot:run
   mvn -f backend/restaurant-service spring-boot:run
   mvn -f backend/menu-service spring-boot:run
   mvn -f backend/cart-service spring-boot:run
   mvn -f backend/order-service spring-boot:run
   mvn -f backend/payment-service spring-boot:run
   ```

## Service ports

- Config Server: `8888`
- Discovery Server: `8761`
- API Gateway: `8080`
- Auth Service: `8091`
- Restaurant Service: `8092`
- Menu Service: `8093`
- Cart Service: `8094`
- Order Service: `8095`
- Payment Service: `8096`

## Notes

- Each microservice is an independent Maven project.
- Kafka is required for `cart-service` event publishing.
- Stripe payment integration is provided by `payment-service`.
- Tracing is enabled by Sleuth and log output includes identifiers for end-to-end correlation.
