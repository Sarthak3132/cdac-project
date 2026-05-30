# Contributing to CDAC Project

Welcome to the project! This guide covers everything you need to contribute effectively — from branching and commits to API design, naming conventions, and test guidelines. Please read this in full before opening your first pull request.

---

## Table of Contents

1. [Project Structure](#project-structure)
2. [Branching Strategy](#branching-strategy)
3. [Commit Message Format](#commit-message-format)
4. [Pull Request Guidelines](#pull-request-guidelines)
5. [REST API Guidelines (Spring Boot)](#rest-api-guidelines-spring-boot)
6. [Auto-Documentation with Springdoc OpenAPI](#auto-documentation-with-springdoc-openapi)
7. [Java Code Practices (Backend & Worker)](#java-code-practices-backend--worker)
8. [React + TypeScript Code Practices (Frontend)](#react--typescript-code-practices-frontend)
9. [Naming Conventions](#naming-conventions)
10. [Variable Conventions](#variable-conventions)
11. [Test Case Guidelines](#test-case-guidelines)
12. [Error Handling](#error-handling)
13. [Security Practices](#security-practices)
14. [Environment & Configuration](#environment--configuration)
15. [Code Review Checklist](#code-review-checklist)

---

## Project Structure

```
cdac-project/
├── backend/       # Spring Boot REST API
├── worker/        # Spring Boot background job / worker service
├── frontend/      # React + TypeScript SPA
└── README.md
```

---

## Branching Strategy

We follow a **three-tier promotion model**:

```
feature/* ──► dev ──► test ──► main
bugfix/*  ──►  │
hotfix/*  ──────────────────► main (emergency only)
```

### Branch Types

| Branch | Purpose | Who merges? |
|---|---|---|
| `main` | Production-ready, stable code | Tech lead only, via PR from `test` |
| `test` | QA / integration testing | Lead dev, via PR from `dev` |
| `dev` | Active development integration | Any dev, via PR from feature branch |
| `feature/<name>` | New feature development | Author, via PR to `dev` |
| `bugfix/<name>` | Non-urgent bug fixes | Author, via PR to `dev` |
| `hotfix/<name>` | Critical production fixes | Author, via PR directly to `main` + back-merge to `dev` |

### Branch Naming Rules

- Use **lowercase kebab-case** only
- Be descriptive but concise (3–6 words max)
- Prefix with the type

```bash
# Good
feature/user-authentication
feature/payment-gateway-integration
bugfix/null-pointer-in-order-service
hotfix/jwt-token-expiry-crash

# Bad
feature/fix          # too vague
myNewFeature         # no type prefix, camelCase
FEATURE/LOGIN        # uppercase
```

### Keeping Your Branch Updated

Always rebase from `dev` before opening a PR to avoid stale conflicts:

```bash
git fetch origin
git rebase origin/dev
```

---

## Commit Message Format

We follow the **Conventional Commits** specification.

### Structure

```
<type>(<scope>): <short summary>

[optional body]

[optional footer]
```

### Types

| Type | When to use |
|---|---|
| `feat` | A new feature |
| `fix` | A bug fix |
| `docs` | Documentation changes only |
| `style` | Formatting, whitespace — no logic change |
| `refactor` | Code restructure with no feature/fix |
| `test` | Adding or updating tests |
| `chore` | Build process, dependencies, tooling |
| `perf` | Performance improvements |
| `ci` | CI/CD pipeline changes |

### Scope (optional but recommended)

Use the module or layer: `auth`, `order`, `payment`, `worker`, `frontend`, `db`, `api`, `config`

### Examples

```bash
# Feature
feat(auth): add JWT refresh token endpoint

# Bug fix with body
fix(order): prevent duplicate order creation on retry

Idempotency check was missing. Added idempotency key validation
in OrderService.createOrder() before persisting to DB.

Closes #42

# Chore
chore(deps): upgrade Spring Boot to 3.3.1

# Documentation
docs(api): add OpenAPI annotations to PaymentController

# Test
test(worker): add unit tests for RetryJobProcessor
```

### Rules

- Summary line: **max 72 characters**, imperative mood ("add", "fix", "update" — not "added" or "fixes")
- No period at the end of the summary line
- Reference issues in the footer: `Closes #<issue-number>` or `Refs #<issue-number>`
- One logical change per commit — avoid "WIP" or "misc fixes" commits before pushing

---

## Pull Request Guidelines

### Before Opening a PR

- [ ] Branch is up to date with `dev` (rebased, not just merged)
- [ ] All tests pass locally (`mvn test` / `npm test`)
- [ ] No unresolved merge conflicts
- [ ] No commented-out dead code committed
- [ ] Environment-specific values are in config, not hardcoded

### PR Title

Follow the same format as commit messages:

```
feat(payment): integrate Razorpay webhook handler
fix(auth): resolve token expiry not refreshing session
```

### PR Description Template

```markdown
## What does this PR do?
Brief description of the change and why it's needed.

## Type of Change
- [ ] New feature
- [ ] Bug fix
- [ ] Refactor
- [ ] Docs / chore

## How to Test
Step-by-step instructions to verify the change manually.

## Screenshots / API Samples (if applicable)

## Linked Issues
Closes #<issue-number>

## Checklist
- [ ] Tests added/updated
- [ ] OpenAPI annotations updated (backend)
- [ ] No sensitive data (keys, passwords) in code
- [ ] Reviewed my own diff before requesting review
```

### Review Rules

- PRs to `dev` require **at least 1 approving review**
- PRs to `test` or `main` require **at least 2 approving reviews** including a tech lead
- Reviewers must respond within **2 working days**
- Do not merge your own PR (except solo hotfixes with team awareness)
- Resolve all review comments before merging; don't dismiss reviews silently
- Prefer **squash merge** to `dev`; **merge commit** for `test → main` to preserve history

---

## REST API Guidelines (Spring Boot)

### URL Design

```
# Resource collections (plural nouns)
GET    /api/v1/orders
POST   /api/v1/orders

# Single resource
GET    /api/v1/orders/{orderId}
PUT    /api/v1/orders/{orderId}
DELETE /api/v1/orders/{orderId}

# Nested resources (max 2 levels deep)
GET    /api/v1/orders/{orderId}/items
POST   /api/v1/orders/{orderId}/items

# Actions that aren't CRUD — use verbs as sub-resources
POST   /api/v1/orders/{orderId}/cancel
POST   /api/v1/payments/{paymentId}/refund
```

### HTTP Methods & Status Codes

| Method | Success | Common Errors |
|---|---|---|
| `GET` | `200 OK` | `404 Not Found` |
| `POST` | `201 Created` | `400 Bad Request`, `409 Conflict` |
| `PUT` | `200 OK` | `400`, `404` |
| `PATCH` | `200 OK` | `400`, `404` |
| `DELETE` | `204 No Content` | `404` |

### Versioning

Always version APIs via the URL path: `/api/v1/`, `/api/v2/`

### Standard Response Envelope

Use a consistent response wrapper for all endpoints:

```java
// Success
{
  "success": true,
  "data": { ... },
  "message": "Order created successfully"
}

// Error
{
  "success": false,
  "error": {
    "code": "ORDER_NOT_FOUND",
    "message": "Order with ID 123 does not exist"
  },
  "timestamp": "2025-01-15T10:30:00Z"
}
```

### Request Validation

Use `@Valid` + Bean Validation annotations on all request DTOs:

```java
public class CreateOrderRequest {

    @NotBlank(message = "Customer ID is required")
    private String customerId;

    @NotNull(message = "Amount is required")
    @Positive(message = "Amount must be positive")
    private BigDecimal amount;

    @NotEmpty(message = "At least one item is required")
    @Valid
    private List<OrderItemRequest> items;
}
```

### Pagination

All list endpoints must support pagination:

```
GET /api/v1/orders?page=0&size=20&sort=createdAt,desc
```

Return pagination metadata in the response:

```json
{
  "success": true,
  "data": {
    "content": [...],
    "page": 0,
    "size": 20,
    "totalElements": 150,
    "totalPages": 8,
    "last": false
  }
}
```

---

## Auto-Documentation with Springdoc OpenAPI

Add the dependency to `pom.xml`:

```xml
<dependency>
    <groupId>org.springdoc</groupId>
    <artifactId>springdoc-openapi-starter-webmvc-ui</artifactId>
    <version>2.5.0</version>
</dependency>
```

Swagger UI will be available at: `http://localhost:8080/swagger-ui.html`

### Annotate All Controllers

```java
@Tag(name = "Orders", description = "Endpoints for order management")
@RestController
@RequestMapping("/api/v1/orders")
public class OrderController {

    @Operation(
        summary = "Create a new order",
        description = "Creates a new order for the authenticated customer. Returns the created order with its ID."
    )
    @ApiResponses({
        @ApiResponse(responseCode = "201", description = "Order created successfully",
            content = @Content(schema = @Schema(implementation = OrderResponse.class))),
        @ApiResponse(responseCode = "400", description = "Validation failed",
            content = @Content(schema = @Schema(implementation = ErrorResponse.class))),
        @ApiResponse(responseCode = "401", description = "Unauthorized")
    })
    @PostMapping
    public ResponseEntity<OrderResponse> createOrder(
            @Valid @RequestBody CreateOrderRequest request) {
        // ...
    }
}
```

### Annotate DTOs

```java
@Schema(description = "Request body for creating an order")
public class CreateOrderRequest {

    @Schema(description = "Unique customer identifier", example = "cust_abc123", required = true)
    private String customerId;

    @Schema(description = "Total order amount in INR", example = "499.99", required = true)
    private BigDecimal amount;
}
```

### Global OpenAPI Config

```java
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI projectOpenAPI() {
        return new OpenAPI()
            .info(new Info()
                .title("CDAC Project API")
                .version("v1")
                .description("Internal API documentation"))
            .addSecurityItem(new SecurityRequirement().addList("BearerAuth"))
            .components(new Components()
                .addSecuritySchemes("BearerAuth",
                    new SecurityScheme()
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")));
    }
}
```

---

## Java Code Practices (Backend & Worker)

### General Rules

- Follow **SOLID** principles — each class has one responsibility
- Prefer **constructor injection** over field injection (`@Autowired` on fields is discouraged)
- Never use `System.out.println` — use **SLF4J + Lombok `@Slf4j`**
- Never swallow exceptions silently — always log or rethrow
- Use `Optional<T>` instead of returning `null` from service methods
- Avoid magic numbers/strings — use constants or enums
- All business logic lives in the **service layer**, not controllers or repositories

### Layered Architecture

```
Controller  →  validates input, delegates to service, returns HTTP response
Service     →  business logic, transactions, orchestration
Repository  →  data access only (JPA/queries)
DTO         →  data transfer between layers and API boundary
Entity      →  JPA-mapped database model
Mapper      →  converts Entity ↔ DTO (use MapStruct)
```

### Package Structure

```
com.cdac.project.
├── config/          # Spring config, beans, security
├── controller/      # REST controllers
├── service/         # Business logic interfaces + implementations
│   └── impl/
├── repository/      # JPA repositories
├── entity/          # JPA entities
├── dto/
│   ├── request/     # Inbound request bodies
│   └── response/    # Outbound response objects
├── mapper/          # MapStruct mappers
├── exception/       # Custom exceptions + global handler
├── util/            # Utility/helper classes
└── constant/        # App-wide constants and enums
```

### Transactions

```java
// Read-only queries — always mark as such for performance
@Transactional(readOnly = true)
public OrderResponse getOrder(String orderId) { ... }

// Write operations
@Transactional
public OrderResponse createOrder(CreateOrderRequest request) { ... }
```

### Logging

```java
@Slf4j
@Service
public class OrderService {

    public OrderResponse createOrder(CreateOrderRequest request) {
        log.info("Creating order for customer: {}", request.getCustomerId());
        try {
            // ...
            log.debug("Order persisted with ID: {}", order.getId());
            return mapper.toResponse(order);
        } catch (Exception e) {
            log.error("Failed to create order for customer {}: {}", request.getCustomerId(), e.getMessage(), e);
            throw e;
        }
    }
}
```

Log levels: `ERROR` = system failures, `WARN` = unexpected but recoverable, `INFO` = business events, `DEBUG` = internal details (disabled in production)

---

## React + TypeScript Code Practices (Frontend)

### General Rules

- **No `any` type** — ever. Use `unknown` and type-narrow if needed
- All components must be **functional** (no class components)
- Use **custom hooks** to encapsulate logic; keep components for rendering only
- Co-locate component files: `ComponentName/index.tsx`, `ComponentName.module.css`, `ComponentName.test.tsx`
- Never fetch data directly in a component — use a service layer (`src/services/`) or React Query
- All API calls go through a centralized Axios instance with interceptors

### Folder Structure

```
src/
├── api/           # Axios instance, API functions
├── components/    # Shared/reusable UI components
│   └── Button/
│       ├── index.tsx
│       ├── Button.module.css
│       └── Button.test.tsx
├── pages/         # Route-level page components
├── hooks/         # Custom React hooks
├── store/         # Global state (Redux / Zustand)
├── types/         # Shared TypeScript types and interfaces
├── utils/         # Pure helper functions
└── constants/     # App-wide constants
```

### Component Structure

```tsx
// Types at the top
interface OrderCardProps {
  orderId: string;
  status: OrderStatus;
  totalAmount: number;
  onCancel: (orderId: string) => void;
}

// Default export at the bottom
const OrderCard: React.FC<OrderCardProps> = ({ orderId, status, totalAmount, onCancel }) => {
  const handleCancel = useCallback(() => {
    onCancel(orderId);
  }, [orderId, onCancel]);

  return (
    <div className={styles.card}>
      {/* JSX */}
    </div>
  );
};

export default OrderCard;
```

### Typing API Responses

Define all API types in `src/types/`:

```ts
// types/order.ts
export interface Order {
  id: string;
  customerId: string;
  status: OrderStatus;
  totalAmount: number;
  createdAt: string;
}

export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
```

---

## Naming Conventions

### Java (Backend / Worker)

| Element | Convention | Example |
|---|---|---|
| Class | `PascalCase` | `OrderService`, `PaymentController` |
| Interface | `PascalCase` (no `I` prefix) | `OrderService`, `PaymentGateway` |
| Method | `camelCase`, verb-first | `createOrder()`, `findByCustomerId()` |
| Variable | `camelCase` | `orderTotal`, `customerId` |
| Constant | `UPPER_SNAKE_CASE` | `MAX_RETRY_COUNT`, `DEFAULT_PAGE_SIZE` |
| Package | `lowercase.dotted` | `com.cdac.project.service` |
| Enum | `PascalCase` / values `UPPER_SNAKE_CASE` | `OrderStatus.PENDING` |
| DTO | suffix `Request` / `Response` | `CreateOrderRequest`, `OrderResponse` |
| Entity | plain noun | `Order`, `Customer` |
| Repository | suffix `Repository` | `OrderRepository` |
| Exception | suffix `Exception` | `OrderNotFoundException` |
| Test class | suffix `Test` | `OrderServiceTest` |

### TypeScript (Frontend)

| Element | Convention | Example |
|---|---|---|
| Component | `PascalCase` | `OrderCard`, `PaymentForm` |
| Hook | `camelCase`, `use` prefix | `useOrderDetails`, `useAuth` |
| Interface / Type | `PascalCase` | `OrderResponse`, `UserProfile` |
| Function | `camelCase`, verb-first | `fetchOrders()`, `handleSubmit()` |
| Variable | `camelCase` | `orderList`, `isLoading` |
| Constant | `UPPER_SNAKE_CASE` | `API_BASE_URL`, `MAX_FILE_SIZE` |
| CSS class | `camelCase` (CSS Modules) | `styles.orderCard` |
| File (component) | `PascalCase.tsx` | `OrderCard.tsx` |
| File (util/hook) | `camelCase.ts` | `useOrderDetails.ts`, `formatDate.ts` |
| Enum | `PascalCase` / values `PascalCase` | `OrderStatus.Pending` |

---

## Variable Conventions

### Boolean Variables

Prefix with `is`, `has`, `can`, `should`:

```java
// Java
boolean isActive;
boolean hasPermission;
boolean canRetry;

// TypeScript
const isLoading: boolean;
const hasError: boolean;
const shouldRedirect: boolean;
```

### Collections

Use plural nouns:

```java
List<Order> orders;
Set<String> customerIds;
Map<String, Order> orderMap;
```

### Avoid Abbreviations

```java
// Bad
int cnt;
String usr;
BigDecimal amt;

// Good
int count;
String username;
BigDecimal amount;
```

### Temporal Variables

Be explicit about units and timezone:

```java
Instant createdAt;           // prefer Instant for UTC timestamps
LocalDate deliveryDate;      // date without time
Duration retryDelaySeconds;  // include unit in name if not obvious
```

---

## Test Case Guidelines

### Java (JUnit 5 + Mockito)

**File placement:** Mirror the source path under `src/test/java/`

**Test method naming:** `methodName_scenario_expectedOutcome`

```java
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderServiceImpl orderService;

    @Test
    void createOrder_validRequest_returnsCreatedOrder() {
        // Arrange
        CreateOrderRequest request = buildValidRequest();
        Order savedOrder = buildOrder();
        when(orderRepository.save(any())).thenReturn(savedOrder);

        // Act
        OrderResponse response = orderService.createOrder(request);

        // Assert
        assertNotNull(response);
        assertEquals(savedOrder.getId(), response.getId());
        verify(orderRepository, times(1)).save(any());
    }

    @Test
    void createOrder_nullCustomerId_throwsValidationException() {
        CreateOrderRequest request = buildValidRequest();
        request.setCustomerId(null);

        assertThrows(ValidationException.class, () -> orderService.createOrder(request));
    }
}
```

**Coverage targets:**

- Service layer: **≥ 80% line coverage**
- Controller layer: integration tests using `@SpringBootTest` + `MockMvc`
- Repositories: test with `@DataJpaTest`

**What to test:**

- Happy path for every public service method
- All validation rules (null, empty, boundary values)
- Exception paths — ensure the right exception type and message
- Edge cases: empty lists, zero amounts, max-length strings

### React (Jest + React Testing Library)

```tsx
// OrderCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import OrderCard from './index';

describe('OrderCard', () => {
  const defaultProps = {
    orderId: 'ord_123',
    status: 'PENDING' as const,
    totalAmount: 499,
    onCancel: jest.fn(),
  };

  it('renders order ID and status', () => {
    render(<OrderCard {...defaultProps} />);
    expect(screen.getByText('ord_123')).toBeInTheDocument();
    expect(screen.getByText('PENDING')).toBeInTheDocument();
  });

  it('calls onCancel with orderId when cancel button is clicked', () => {
    render(<OrderCard {...defaultProps} />);
    fireEvent.click(screen.getByRole('button', { name: /cancel/i }));
    expect(defaultProps.onCancel).toHaveBeenCalledWith('ord_123');
  });

  it('does not show cancel button for delivered orders', () => {
    render(<OrderCard {...defaultProps} status="DELIVERED" />);
    expect(screen.queryByRole('button', { name: /cancel/i })).not.toBeInTheDocument();
  });
});
```

**Rules:**

- Query elements by **role or label**, not by test IDs or class names (prefer `getByRole`, `getByLabelText`)
- Test **user behavior**, not implementation details
- Mock external API calls at the service/hook boundary
- Do not test internal state directly

---

## Error Handling

### Global Exception Handler (Spring Boot)

Create a single `@RestControllerAdvice` class:

```java
@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(ResourceNotFoundException ex) {
        log.warn("Resource not found: {}", ex.getMessage());
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
            .body(ErrorResponse.of("RESOURCE_NOT_FOUND", ex.getMessage()));
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex) {
        String message = ex.getBindingResult().getFieldErrors().stream()
            .map(e -> e.getField() + ": " + e.getDefaultMessage())
            .collect(Collectors.joining(", "));
        return ResponseEntity.badRequest()
            .body(ErrorResponse.of("VALIDATION_FAILED", message));
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleGeneric(Exception ex) {
        log.error("Unhandled exception", ex);
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
            .body(ErrorResponse.of("INTERNAL_ERROR", "An unexpected error occurred"));
    }
}
```

### Frontend Error Handling

- Wrap API calls in try/catch or use React Query's `onError`
- Show user-friendly messages — never expose raw error objects in the UI
- Log errors to the console in development; forward to a monitoring service in production

---

## Security Practices

- **Never commit secrets** — no API keys, passwords, or tokens in source code. Use `.env` files (gitignored) and environment variables
- **Input validation** on all endpoints — both at the DTO level (`@Valid`) and service level
- **HTTPS only** in test and production environments
- **Do not log sensitive data** — mask PII, card numbers, tokens in logs
- Use **parameterized queries** only — never concatenate user input into SQL or JPQL
- JWT secrets must be at least 256 bits and stored in environment config
- Set appropriate **CORS origins** — never use `*` in non-development environments
- Validate **file uploads**: type, size, and sanitize filenames

---

## Environment & Configuration

### Property Files

```
src/main/resources/
├── application.yml           # Shared defaults
├── application-dev.yml       # Dev overrides
├── application-test.yml      # Test env overrides
└── application-prod.yml      # Prod overrides (no secrets here)
```

### Rules

- Activate profiles via `SPRING_PROFILES_ACTIVE` environment variable
- Sensitive values (`DB_PASSWORD`, `JWT_SECRET`) come from environment variables only, never from committed property files
- Use `@ConfigurationProperties` over `@Value` for grouping related config

---

## Code Review Checklist

Use this when reviewing a PR:

**Correctness**
- [ ] Does the code do what the PR description says?
- [ ] Are edge cases handled?
- [ ] Are exceptions caught and handled appropriately?

**Design**
- [ ] Is business logic in the service layer (not controller or entity)?
- [ ] Does each class/component have a single responsibility?
- [ ] Are there obvious opportunities to reuse existing code?

**Tests**
- [ ] Are new features covered by tests?
- [ ] Are failure paths tested, not just the happy path?

**Security**
- [ ] No hardcoded credentials or secrets?
- [ ] Are inputs validated?
- [ ] Are SQL queries parameterized?

**Documentation**
- [ ] Are new endpoints annotated with OpenAPI (`@Operation`, `@ApiResponse`)?
- [ ] Are complex methods or business rules commented?

**Conventions**
- [ ] Do naming, formatting, and structure follow this guide?
- [ ] Are commit messages in the correct format?

---

## Getting Help

- Raise questions in the team chat before opening a PR for a significant design decision
- If you're stuck on a review comment for more than 24 hours, flag it in chat rather than leaving it stale
- For urgent production issues, follow the hotfix branch process and notify the team immediately

---

*This document is a living guide. Propose changes via a PR that updates `CONTRIBUTING.md` directly.*
