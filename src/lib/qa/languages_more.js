// Additional Languages Q&A dataset: Java, C#, C++, C, Go, Rust, PHP, Ruby, Kotlin, Swift, Dart, HTML5, CSS3
// Covers all 15 modules for each language with detailed explanations, practical code examples, and key takeaways.

export const QA_LANGUAGES_MORE = [
    // ==========================================
    // JAVA (15 Modules)
    // ==========================================
    {
        question: "How does the Java Collections Framework organize List, Set, and Map interfaces?",
        answer: "The Java Collections Framework provides a unified architecture for storing and manipulating collections of objects.\n\n• `List` (ArrayList, LinkedList): Ordered collection that permits duplicate elements and provides index-based access.\n• `Set` (HashSet, TreeSet): Collection containing no duplicate elements. `TreeSet` maintains sorted order.\n• `Map` (HashMap, ConcurrentHashMap): Stores key-value mappings with unique keys.\n• `Queue` / `Deque` (ArrayDeque, PriorityQueue): FIFO or priority-based processing.",
        example: `import java.util.*;

public class CollectionDemo {
    public static void main(String[] args) {
        // Fast hash-based lookup
        Map<String, Integer> stock = new HashMap<>();
        stock.put("MacBook", 15);
        stock.put("iPhone", 42);

        // Deduplication using Set
        Set<String> uniqueTags = new HashSet<>(Arrays.asList("tech", "apple", "tech"));
        System.out.println("Unique tags count: " + uniqueTags.size()); // 2

        // Fast sequential iteration with ArrayList
        List<String> items = new ArrayList<>(stock.keySet());
        items.forEach(item -> System.out.println(item + " -> " + stock.get(item)));
    }
}`,
        explanation: "`HashMap` provides O(1) average lookup and insertion by calculating the key's `hashCode()`. `HashSet` internally delegates to a `HashMap` backing instance.",
        moduleSlug: "collections-framework",
        category: "java",
        language: "java"
    },
    {
        question: "How do Java Streams and Lambda Expressions simplify functional data processing?",
        answer: "Introduced in Java 8, Streams provide a declarative pipeline for processing sequences of elements. Streams do not store elements; they carry values from a data source through computational steps.\n\nStream operations are divided into:\n1. Intermediate operations (lazy): `filter()`, `map()`, `sorted()`, `distinct()`.\n2. Terminal operations (eager): `collect()`, `forEach()`, `reduce()`, `count()`.",
        example: `import java.util.List;
import java.util.stream.Collectors;

public class StreamPipeline {
    record Employee(String name, String department, double salary) {}

    public static void main(String[] args) {
        List<Employee> staff = List.of(
            new Employee("Alice", "Engineering", 120000),
            new Employee("Bob", "Marketing", 75000),
            new Employee("Charlie", "Engineering", 140000)
        );

        List<String> highEarners = staff.stream()
            .filter(e -> e.department().equals("Engineering"))
            .filter(e -> e.salary() > 100000)
            .map(Employee::name)
            .sorted()
            .collect(Collectors.toList());

        System.out.println("High earning engineers: " + highEarners); // [Alice, Charlie]
    }
}`,
        explanation: "Because intermediate operations like `filter` and `map` are evaluated lazily, elements are processed in a single pass without allocating intermediate collection buffers.",
        moduleSlug: "streams-lambdas",
        category: "java",
        language: "java"
    },
    {
        question: "How do abstract classes and interfaces differ in modern Java?",
        answer: "• Abstract Classes: Represent an 'is-a' relationship. Can define instance fields, state, and constructors, and classes can only inherit from one abstract class (single inheritance).\n• Interfaces: Represent a 'can-do' capability contract. Classes can implement multiple interfaces. Since Java 8, interfaces can contain `default` and `static` methods, and Java 9 added `private` methods.",
        example: `public interface Auditable {
    // Default method provides default behavior without breaking implementers
    default void logAudit(String action) {
        System.out.println("AUDIT [" + System.currentTimeMillis() + "]: " + action);
    }
}

public abstract class BaseEntity {
    private final String id;
    public BaseEntity(String id) { this.id = id; }
    public String getId() { return id; }
}

public class Order extends BaseEntity implements Auditable {
    public Order(String id) { super(id); }
}`,
        explanation: "Java allows multiple interface inheritance, letting `Order` inherit identity from `BaseEntity` while adopting auditing capabilities from `Auditable`.",
        moduleSlug: "oop-interfaces",
        category: "java",
        language: "java"
    },
    {
        question: "What is the difference between Checked and Unchecked Exceptions in Java?",
        answer: "• Checked Exceptions (inherit directly from `Exception`): Checked at compile-time. The compiler enforces that callers must either catch them with `try-catch` or declare them with `throws` (e.g. `IOException`, `SQLException`).\n• Unchecked Exceptions (inherit from `RuntimeException`): Caused by programming bugs or logic flaws (e.g. `NullPointerException`, `IllegalArgumentException`). The compiler does not force explicit handling.",
        example: `import java.io.*;

public class ExceptionDemo {
    // Checked Exception: must be declared in throws signature
    public static String readFileSafe(String path) throws IOException {
        if (path == null) {
            // Unchecked Exception: programming error
            throw new IllegalArgumentException("Path cannot be null");
        }
        try (BufferedReader reader = new BufferedReader(new FileReader(path))) {
            return reader.readLine();
        }
    }
}`,
        explanation: "The `try-with-resources` statement guarantees `reader.close()` is invoked automatically when exiting the block, preventing file descriptor leaks.",
        moduleSlug: "exception-handling",
        category: "java",
        language: "java"
    },
    {
        question: "How does Java handle multithreading and what are Virtual Threads (Project Loom)?",
        answer: "Traditionally, every `java.lang.Thread` mapped 1:1 to an operating system kernel thread, consuming ~1MB of stack memory and making millions of concurrent threads impractical.\n\nJava 21 introduced **Virtual Threads**: lightweight, JVM-managed user-mode threads that run on a small pool of carrier OS threads. When a virtual thread blocks on socket I/O, the JVM unmounts it and runs another task, allowing millions of concurrent tasks with standard blocking code.",
        example: `import java.util.concurrent.Executors;

public class VirtualThreadDemo {
    public static void main(String[] args) {
        // Create an executor that spawns a virtual thread per task
        try (var executor = Executors.newVirtualThreadPerTaskExecutor()) {
            for (int i = 0; i < 10_000; i++) {
                final int taskId = i;
                executor.submit(() -> {
                    Thread.sleep(100); // Does NOT block an OS thread!
                    return "Task " + taskId + " complete";
                });
            }
        } // Automatically waits for all 10,000 tasks to finish!
        System.out.println("All virtual threads finished!");
    }
}`,
        explanation: "Spawning 10,000 platform threads would exhaust OS memory. Virtual threads consume only bytes of RAM and yield carrier threads during `Thread.sleep` or I/O.",
        moduleSlug: "multithreading-concurrency",
        category: "java",
        language: "java"
    },
    {
        question: "How does Type Erasure work in Java Generics?",
        answer: "Java Generics provide compile-time type safety. However, to maintain backwards compatibility with pre-Java 5 bytecode, the Java compiler uses **Type Erasure**: it removes all generic type parameters at compile-time and inserts type casts.\n\nAs a consequence, you cannot check `instanceof List<String>` at runtime or instantiate generic arrays (`new T[]`).",
        example: `public class GenericBox<T> {
    private T item;
    public void set(T item) { this.item = item; }
    public T get() { return item; }
    
    // In compiled bytecode, T is erased to Object:
    // private Object item;
    // public Object get() { return (T) item; }
}`,
        explanation: "Type erasure allows legacy libraries to call generic methods without binary incompatibility, while IDEs and compilers catch type mismatches during development.",
        moduleSlug: "generics",
        category: "java",
        language: "java"
    },
    {
        question: "What is the JVM Memory Model (Heap, Stack, Metaspace) and how do they interact?",
        answer: "The JVM divides runtime memory into distinct regions:\n\n• **Stack**: Thread-private memory. Stores method stack frames, primitive local variables, and object references. Allocation and deallocation are instant (LIFO).\n• **Heap**: Shared memory where all object instances live. Managed by the Garbage Collector.\n• **Metaspace**: Native memory holding class metadata, bytecode definitions, and static variables (replaces PermGen in Java 8+).",
        example: `public class MemoryModelDemo {
    // Static reference stored in Metaspace / Heap
    private static final String APP_NAME = "LearnaApp";

    public void processOrder() {
        int orderCount = 5; // Local primitive: stored in thread Stack
        Order order = new Order(); // 'order' reference on Stack; Order object instance on Heap!
    }
}
class Order {}`,
        explanation: "When `processOrder()` finishes, its stack frame is instantly popped. The `Order` object on the heap becomes eligible for Garbage Collection.",
        moduleSlug: "jvm-memory-model",
        category: "java",
        language: "java"
    },
    {
        question: "How does Garbage Collection operate in modern Java (G1GC and ZGC)?",
        answer: "Java uses generational garbage collection based on the **Weak Generational Hypothesis**: most objects die shortly after creation.\n\n• G1GC (Garbage-First): Divides the heap into equal-sized regions, prioritizing regions with the most garbage to meet user-defined pause targets (`-XX:MaxGCPauseMillis`).\n• ZGC (Z Garbage Collector): A scalable low-latency GC capable of handling terabyte heaps with sub-millisecond maximum pause times by performing all object relocation concurrently with running application threads.",
        example: `# Launch Java application with ZGC for low-latency microservices
java -XX:+UseZGC -XX:+ZGenerational -Xmx8g -jar app.jar`,
        explanation: "Generational ZGC keeps GC pause times under 1 millisecond regardless of whether the heap is 1GB or 16TB.",
        moduleSlug: "garbage-collection",
        category: "java",
        language: "bash"
    },
    {
        question: "Why must you override both equals() and hashCode() together in Java?",
        answer: "The contract between `equals()` and `hashCode()` states that: **if two objects are equal according to equals(), they MUST have the same hashCode()**.\n\nIf you override `equals()` without overriding `hashCode()`, hash-based collections like `HashMap` and `HashSet` will store duplicates or fail to find existing keys because they check hash bucket placement first.",
        example: `import java.util.Objects;

public class EmployeeId {
    private final String department;
    private final int number;

    public EmployeeId(String department, int number) {
        this.department = department;
        this.number = number;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof EmployeeId other)) return false;
        return number == other.number && Objects.equals(department, other.department);
    }

    @Override
    public int hashCode() {
        return Objects.hash(department, number);
    }
}`,
        explanation: "By hashing both `department` and `number`, two distinct object instances with identical field values produce the exact same hash code and resolve to the same `HashMap` bucket.",
        moduleSlug: "equals-hashcode",
        category: "java",
        language: "java"
    },
    {
        question: "What are common Design Patterns in Java (Singleton, Builder, Strategy)?",
        answer: "• Builder Pattern: Separates the construction of a complex object from its representation, avoiding constructor parameter explosion.\n• Strategy Pattern: Defines a family of algorithms, encapsulating each one and making them interchangeable at runtime.",
        example: `// Builder Pattern Implementation
public class ServerConfig {
    private final String host;
    private final int port;
    private final boolean ssl;

    private ServerConfig(Builder builder) {
        this.host = builder.host;
        this.port = builder.port;
        this.ssl = builder.ssl;
    }

    public static class Builder {
        private String host = "localhost";
        private int port = 8080;
        private boolean ssl = false;

        public Builder host(String host) { this.host = host; return this; }
        public Builder port(int port) { this.port = port; return this; }
        public Builder ssl(boolean ssl) { this.ssl = ssl; return this; }
        public ServerConfig build() { return new ServerConfig(this); }
    }
}

// Fluent usage:
ServerConfig cfg = new ServerConfig.Builder().host("api.domain.com").port(443).ssl(true).build();`,
        explanation: "The Builder pattern provides readable, fluent object configuration without needing telescoping constructors with multiple ambiguous parameters.",
        moduleSlug: "design-patterns",
        category: "java",
        language: "java"
    },
    {
        question: "What are Functional Interfaces in Java (Predicate, Function, Consumer, Supplier)?",
        answer: "A Functional Interface has exactly one abstract method and is eligible to be target for lambda expressions. Annotated with `@FunctionalInterface`.\n\n• `Predicate<T>`: `T -> boolean` (filtering)\n• `Function<T, R>`: `T -> R` (transformation)\n• `Consumer<T>`: `T -> void` (side-effects)\n• `Supplier<T>`: `() -> T` (lazy instantiation)",
        example: `import java.util.function.*;

public class FunctionalDemo {
    public static void main(String[] args) {
        Predicate<Integer> isPositive = n -> n > 0;
        Function<String, Integer> stringLength = String::length;
        Consumer<String> logger = System.out::println;
        Supplier<Double> randomGen = Math::random;

        if (isPositive.test(10)) {
            logger.accept("Length: " + stringLength.apply("Antigravity"));
        }
    }
}`,
        explanation: "Functional interfaces form the foundational contracts for the Java Stream API and asynchronous `CompletableFuture` chains.",
        moduleSlug: "functional-interfaces",
        category: "java",
        language: "java"
    },
    {
        question: "How does Optional help prevent NullPointerExceptions in Java?",
        answer: "`Optional<T>` is a container object used to represent the presence or absence of a value, replacing risky `null` returns from methods.\n\nIt forces API callers to explicitly think about and handle the empty case using methods like `map()`, `orElse()`, and `ifPresent()`.",
        example: `import java.util.Optional;

public class UserService {
    public Optional<String> findEmailById(int userId) {
        if (userId == 1) return Optional.of("alex@domain.com");
        return Optional.empty(); // Clean alternative to returning null
    }

    public void process(int id) {
        String email = findEmailById(id)
            .map(String::toLowerCase)
            .orElse("guest@domain.com");
        System.out.println("Assigned email: " + email);
    }
}`,
        explanation: "Returning `Optional` signals to callers in the method signature that the value might be absent, avoiding accidental `NullPointerException` crashes.",
        moduleSlug: "optional-null-safety",
        category: "java",
        language: "java"
    },
    {
        question: "How does the String Pool and String Immutability work in Java?",
        answer: "Strings in Java are immutable: once created, their internal byte array cannot be changed.\n\nTo conserve memory, the JVM maintains the **String Pool** inside the Heap. When string literals are created (`\"abc\"`), the JVM reuses existing instances from the pool. Calling `new String(\"abc\")` bypasses the pool and allocates a new heap object.",
        example: `public class StringPoolDemo {
    public static void main(String[] args) {
        String s1 = "hello";
        String s2 = "hello"; // Reuses instance from String Pool
        String s3 = new String("hello"); // New object on Heap

        System.out.println(s1 == s2);      // true (Same memory reference!)
        System.out.println(s1 == s3);      // false (Different objects)
        System.out.println(s1.equals(s3)); // true (Same content value)
    }
}`,
        explanation: "String immutability makes Strings inherently thread-safe and allows caching their `hashCode()` for instant `HashMap` lookups.",
        moduleSlug: "string-pool-immutability",
        category: "java",
        language: "java"
    },
    {
        question: "What is the Java Reflection API and what are its performance trade-offs?",
        answer: "Reflection allows inspecting and invoking classes, constructors, methods, and fields at runtime without prior compile-time knowledge.\n\nIt is foundational for dependency injection frameworks (Spring, Hibernate), but it bypasses compile-time type safety, defeats compiler inlining optimizations, and incurs reflective lookup overhead.",
        example: `import java.lang.reflect.Method;

public class ReflectionDemo {
    public static void main(String[] args) throws Exception {
        Class<?> clazz = Class.forName("java.util.ArrayList");
        Object listInstance = clazz.getDeclaredConstructor().newInstance();

        Method addMethod = clazz.getMethod("add", Object.class);
        addMethod.invoke(listInstance, "Item added via reflection!");

        System.out.println("Result: " + listInstance);
    }
}`,
        explanation: "Reflection dynamically analyzes class bytecode at runtime, allowing frameworks to instantiate beans and inject dependencies automatically.",
        moduleSlug: "reflection-api",
        category: "java",
        language: "java"
    },
    {
        question: "How does Spring Boot build on top of Core Java basics?",
        answer: "Core Java provides the standard library, collections, and concurrency primitives. **Spring Boot** adds an enterprise framework layer providing:\n1. Inversion of Control (IoC) and Dependency Injection (DI) to manage object lifecycles.\n2. Opinionated starter templates that configure databases, web servers (embedded Tomcat), and metrics automatically.\n3. Aspect-Oriented Programming (AOP) for declarative transactions (`@Transactional`).",
        example: `import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.web.bind.annotation.*;

@SpringBootApplication
@RestController
public class QuickApp {
    @GetMapping("/api/greet")
    public String greet(@RequestParam(defaultValue = "World") String name) {
        return "Hello, " + name + " from Spring Boot!";
    }

    public static void main(String[] args) {
        SpringApplication.run(QuickApp.class, args);
    }
}`,
        explanation: "Spring Boot converts standard Java classes into production-grade REST APIs with embedded servers and automatic JSON serialization in just a few annotations.",
        moduleSlug: "spring-vs-core-java-basics",
        category: "java",
        language: "java"
    },

    // ==========================================
    // GO (15 Modules)
    // ==========================================
    {
        question: "How do Goroutines and Channels enable concurrency in Go?",
        answer: "Go implements concurrency through Communicating Sequential Processes (CSP): 'Do not communicate by sharing memory; instead, share memory by communicating.'\n\n• **Goroutines**: Extremely lightweight threads managed by the Go runtime, starting with only ~2KB of stack space that grows and shrinks dynamically.\n• **Channels**: Typed conduits through which you can send and receive values with the `<-` operator, synchronizing execution without explicit mutex locks.",
        example: `package main

import (
	"fmt"
	"time"
)

func fetchWorker(id int, ch chan string) {
	time.Sleep(50 * time.Millisecond) // Simulate network call
	ch <- fmt.Sprintf("Result from worker %d", id)
}

func main() {
	results := make(chan string, 3) // Buffered channel

	for i := 1; i <= 3; i++ {
		go fetchWorker(i, results) // Launch concurrent goroutines
	}

	for i := 1; i <= 3; i++ {
		msg := <-results // Receive from channel
		fmt.Println(msg)
	}
}`,
        explanation: "Goroutines cost a fraction of OS threads. Launching hundreds of thousands of concurrent goroutines is standard practice in Go services.",
        moduleSlug: "goroutines-channels",
        category: "go",
        language: "go"
    },
    {
        question: "How do Structs and implicit Interfaces work in Go?",
        answer: "Go does not have a `class` keyword or traditional inheritance. Instead, it uses **Structs** for data encapsulation and **Composition** (embedding).\n\nInterfaces in Go are satisfied **implicitly**: a type implements an interface simply by implementing its method signatures; there is no `implements` keyword.",
        example: `package main

import "fmt"

type Greeter interface {
	Greet() string
}

type User struct {
	Name string
}

// User automatically satisfies Greeter without explicit declaration
func (u User) Greet() string {
	return "Hello, my name is " + u.Name
}

func PrintGreeting(g Greeter) {
	fmt.Println(g.Greet())
}

func main() {
	u := User{Name: "Sam"}
	PrintGreeting(u) // Works seamlessly!
}`,
        explanation: "Implicit interfaces decouple package implementations. Consumers can define small interfaces matching only the behavior they need.",
        moduleSlug: "structs-interfaces",
        category: "go",
        language: "go"
    },
    {
        question: "How does explicit Error Handling work in Go and why are errors values?",
        answer: "Go treats errors as ordinary values implementing the `error` interface (`Error() string`). Functions return error as an explicit secondary return value, and callers check `if err != nil`.\n\nGo 1.13 introduced error wrapping (`fmt.Errorf(\"...: %w\", err)`), `errors.Is()`, and `errors.As()` to inspect wrapped error hierarchies.",
        example: `package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("record not found")

func FindUser(id int) (string, error) {
	if id != 100 {
		return "", fmt.Errorf("lookup error for ID %d: %w", id, ErrNotFound)
	}
	return "Alex", nil
}

func main() {
	user, err := FindUser(42)
	if err != nil {
		if errors.Is(err, ErrNotFound) {
			fmt.Println("Handled missing user safely:", err)
			return
		}
		fmt.Println("Unexpected error:", err)
		return
	}
	fmt.Println("Found:", user)
}`,
        explanation: "Explicit error checking forces developers to address error branches directly at the call-site, avoiding unhandled exception crashes.",
        moduleSlug: "error-handling",
        category: "go",
        language: "go"
    },
    {
        question: "What is the difference between Slices and Arrays in Go?",
        answer: "• Arrays: Fixed-length, value types. The size is part of the type signature (`[5]int` is a different type than `[10]int`). Passing an array copies all its elements.\n• Slices: Dynamic, lightweight descriptors wrapping an underlying array. A slice consists of a pointer to the array, a length (`len`), and a capacity (`cap`).",
        example: `package main

import "fmt"

func main() {
	// Slice literal
	s := []int{10, 20, 30}
	fmt.Printf("Len: %d, Cap: %d\\n", len(s), cap(s))

	// Append dynamically allocates larger backing array when capacity is exceeded
	s = append(s, 40, 50)
	fmt.Printf("After append: Len: %d, Cap: %d\\n", len(s), cap(s))
}`,
        explanation: "Passing slices to functions is cheap because only the 24-byte slice header (pointer, length, capacity) is copied, not the underlying array.",
        moduleSlug: "slices-vs-arrays",
        category: "go",
        language: "go"
    },
    {
        question: "How do defer, panic, and recover manage control flow and cleanup in Go?",
        answer: "• `defer`: Defers execution of a function until the surrounding function returns. Evaluated in LIFO (last-in, first-out) order. Essential for releasing mutexes and closing files.\n• `panic`: Halts normal execution, runs deferred functions, and crashes the program with a stack trace.\n• `recover`: Built-in function that regains control of a panicking goroutine when called inside a deferred function.",
        example: `package main

import "fmt"

func safeExecute() {
	defer func() {
		if r := recover(); r != nil {
			fmt.Printf("Recovered from panic: %v\\n", r)
		}
	}()

	fmt.Println("Executing task...")
	panic("Catastrophic runtime failure!")
}

func main() {
	safeExecute()
	fmt.Println("Program recovered and continuing normally.")
}`,
        explanation: "`defer` ensures cleanup routines execute reliably even when unexpected panics interrupt function execution.",
        moduleSlug: "defer-panic-recover",
        category: "go",
        language: "go"
    },
    {
        question: "What are common Go Concurrency Patterns (Worker Pools, Fan-In/Fan-Out)?",
        answer: "Common Go concurrency architectures:\n• Worker Pool: A fixed number of goroutines consuming tasks from a shared channel, bounding resource usage.\n• Fan-Out: Distributing multiple tasks across multiple goroutines to run in parallel.\n• Fan-In: Combining outputs from multiple channels into a single consolidated channel.",
        example: `package main

import "fmt"

func worker(id int, jobs <-chan int, results chan<- int) {
	for j := range jobs {
		results <- j * 2 // Process job
	}
}

func main() {
	const numJobs = 5
	jobs := make(chan int, numJobs)
	results := make(chan int, numJobs)

	// Launch 3 concurrent workers in pool
	for w := 1; w <= 3; w++ {
		go worker(w, jobs, results)
	}

	for j := 1; j <= numJobs; j++ {
		jobs <- j
	}
	close(jobs)

	for a := 1; a <= numJobs; a++ {
		fmt.Println("Result:", <-results)
	}
}`,
        explanation: "Worker pools prevent unbounded goroutine creation, keeping memory usage constant regardless of input task volume.",
        moduleSlug: "concurrency-patterns",
        category: "go",
        language: "go"
    },
    {
        question: "How do Pointers work in Go and how does escape analysis determine heap vs stack allocation?",
        answer: "Go has pointers allowing you to pass memory references (`&val`) instead of copying data. Unlike C, Go does not support pointer arithmetic.\n\nThe Go compiler performs **Escape Analysis**: if a variable cannot be referenced outside its defining function frame, it is allocated on the fast stack. If a reference escapes the function (e.g. returning a pointer), the compiler transparently allocates it on the heap.",
        example: `package main

type Config struct {
	MaxRetries int
}

// Compiler escape analysis puts 'cfg' on the heap because the pointer escapes
func NewConfig() *Config {
	cfg := Config{MaxRetries: 3}
	return &cfg // Completely safe in Go!
}`,
        explanation: "Returning pointers to local variables is safe in Go because the compiler detects the escape and automatically promotes the allocation to the heap.",
        moduleSlug: "pointers",
        category: "go",
        language: "go"
    },
    {
        question: "How do Maps work in Go and why are they not safe for concurrent writes?",
        answer: "A Map in Go is a hash table reference type: `map[KeyType]ValueType`. Keys must be comparable types.\n\nGo maps **are not safe for concurrent read and write operations**. Concurrent map access causes a fatal runtime crash. For concurrent environments, use `sync.RWMutex` or `sync.Map`.",
        example: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95

	// Safe read with comma-ok idiom
	val, exists := scores["Bob"]
	if !exists {
		fmt.Println("Bob is not registered in the map!")
	} else {
		fmt.Println("Bob's score:", val)
	}
}`,
        explanation: "The comma-ok idiom (`val, ok := map[key]`) safely distinguishes between a missing key and a key whose stored value happens to be zero.",
        moduleSlug: "maps",
        category: "go",
        language: "go"
    },
    {
        question: "How does Go Modules (go.mod) handle dependency management and semantic versioning?",
        answer: "Go Modules is Go's official package dependency system, defined by `go.mod` and locked by `go.sum`.\n\nIt uses **Minimal Version Selection (MVS)**: the compiler selects the minimal version that satisfies all module constraints, avoiding unexpected breaking updates.",
        example: `# Initialize a new module
go mod init github.com/username/service

# Add dependencies automatically
go get github.com/google/uuid

# Clean up unused dependencies and populate go.sum
go mod tidy`,
        explanation: "`go.sum` contains cryptographic hashes of downloaded packages, preventing supply-chain tampering across development environments.",
        moduleSlug: "package-management-go-modules",
        category: "go",
        language: "bash"
    },
    {
        question: "How does the Context package handle cancellation, timeouts, and deadlines in Go?",
        answer: "`context.Context` carries cancellation signals, deadlines, and request-scoped values across API boundaries and goroutines.\n\nWhen a parent context is cancelled or times out, all child goroutines listening on `ctx.Done()` terminate immediately, preventing orphaned background leaks.",
        example: `package main

import (
	"context"
	"fmt"
	"time"
)

func queryDatabase(ctx context.Context) {
	select {
	case <-time.After(200 * time.Millisecond):
		fmt.Println("Query completed")
	case <-ctx.Done():
		fmt.Println("Query aborted due to timeout:", ctx.Err())
	}
}

func main() {
	// Cancel query if it exceeds 50ms
	ctx, cancel := context.WithTimeout(context.Background(), 50*time.Millisecond)
	defer cancel()

	queryDatabase(ctx)
}`,
        explanation: "Using `context.WithTimeout` prevents hanging microservice calls from keeping network sockets open indefinitely.",
        moduleSlug: "context-package",
        category: "go",
        language: "go"
    },
    {
        question: "How does Struct Embedding provide composition over inheritance in Go?",
        answer: "Go favors composition through **Struct Embedding**: fields and methods of an embedded struct are 'promoted' to the outer struct, allowing direct access as if they were declared natively.",
        example: `package main

import "fmt"

type Author struct {
	Name string
}
func (a Author) Sign() string {
	return "Written by " + a.Name
}

type Article struct {
	Author // Embedded struct
	Title  string
}

func main() {
	post := Article{
		Author: Author{Name: "Robin"},
		Title:  "Go Architecture Patterns",
	}
	// Sign() method is promoted directly to post!
	fmt.Println(post.Sign()) // "Written by Robin"
}`,
        explanation: "Composition via embedding achieves code reuse without the rigid fragility of deep inheritance hierarchies.",
        moduleSlug: "interfaces-composition",
        category: "go",
        language: "go"
    },
    {
        question: "How does the select statement coordinate communication across multiple channels in Go?",
        answer: "The `select` statement blocks until one of its channel communication cases is ready to execute. If multiple channels are ready simultaneously, one is chosen at pseudo-random.\n\nA `default` clause makes channel communication non-blocking.",
        example: `package main

import "fmt"

func main() {
	ch1 := make(chan string, 1)
	ch1 <- "Message from Ch1"

	select {
	case msg := <-ch1:
		fmt.Println("Received:", msg)
	default:
		fmt.Println("No messages ready to read.")
	}
}`,
        explanation: "`select` allows goroutines to listen to data streams, cancellation signals, and timers concurrently.",
        moduleSlug: "select-statement",
        category: "go",
        language: "go"
    },
    {
        question: "How do sync.Mutex and sync.WaitGroup synchronize concurrent execution in Go?",
        answer: "• `sync.WaitGroup`: Waits for a collection of goroutines to finish. You increment with `Add()`, decrement inside goroutines with `Done()`, and block with `Wait()`.\n• `sync.Mutex`: Provides mutual exclusion locks to prevent concurrent race conditions on shared memory.",
        example: `package main

import (
	"fmt"
	"sync"
)

type SafeCounter struct {
	mu    sync.Mutex
	count int
}

func (c *SafeCounter) Increment(wg *sync.WaitGroup) {
	defer wg.Done()
	c.mu.Lock()
	defer c.mu.Unlock()
	c.count++
}

func main() {
	var wg sync.WaitGroup
	counter := SafeCounter{}

	for i := 0; i < 100; i++ {
		wg.Add(1)
		go counter.Increment(&wg)
	}

	wg.Wait()
	fmt.Println("Final count:", counter.count) // Guaranteed 100
}`,
        explanation: "`sync.Mutex` ensures that only one goroutine increments `count` at a time, preventing race condition data corruption.",
        moduleSlug: "sync-package-mutexwaitgroup",
        category: "go",
        language: "go"
    },
    {
        question: "How does Testing in Go work with the testing package and Table-Driven Tests?",
        answer: "Go includes a built-in testing framework (`go test`). Test files are named with the `_test.go` suffix.\n\n**Table-Driven Tests** are the Go idiom: defining test cases as an array/slice of structs containing inputs and expected outputs, iterated using `t.Run()`.",
        example: `package mathutil_test

import "testing"

func Add(a, b int) int { return a + b }

func TestAdd(t *testing.T) {
	cases := []struct {
		name     string
		a, b     int
		expected int
	}{
		{"positive numbers", 2, 3, 5},
		{"negative numbers", -2, -3, -5},
		{"zero value", 5, 0, 5},
	}

	for _, tc := range cases {
		t.Run(tc.name, func(t *testing.T) {
			got := Add(tc.a, tc.b)
			if got != tc.expected {
				t.Errorf("Add(%d, %d) = %d; expected %d", tc.a, tc.b, got, tc.expected)
			}
		})
	}
}`,
        explanation: "Table-driven tests make adding new edge cases as simple as adding a single line to the test slice.",
        moduleSlug: "testing-in-go",
        category: "go",
        language: "go"
    },
    {
        question: "How does Garbage Collection work in Go and how does it achieve sub-millisecond pauses?",
        answer: "Go uses a concurrent, tri-color mark-and-sweep garbage collector designed for ultra-low latency.\n\nIt runs concurrently with application goroutines using a write barrier to track pointer adjustments. GC target pacing is controlled by the `GOGC` environment variable (default 100).",
        example: `# Run application with GC trace logs enabled
GODEBUG=gctrace=1 ./myservice

# Adjust GC trigger ratio (e.g. trigger GC at 50% heap growth)
export GOGC=50`,
        explanation: "By avoiding complex generational compactions and keeping object allocations on the stack whenever possible, Go GC pauses routinely stay below 1 millisecond.",
        moduleSlug: "garbage-collection",
        category: "go",
        language: "bash"
    },

    // ==========================================
    // RUST (15 Modules)
    // ==========================================
    {
        question: "How do Ownership and Borrowing guarantee memory safety in Rust without a garbage collector?",
        answer: "Rust manages memory through a strict compile-time **Ownership** system with three fundamental rules:\n1. Each value in Rust has an owner variable.\n2. There can only be one owner at a time.\n3. When the owner goes out of scope, the value is automatically dropped (`Drop` trait).\n\n**Borrowing Rules**:\n• You may have any number of immutable references (`&T`).\n• OR you may have exactly one mutable reference (`&mut T`).\n• But never both simultaneously, preventing data races at compile time.",
        example: `fn main() {
    let mut greeting = String::from("Hello");

    // Immutable borrow
    let r1 = &greeting;
    let r2 = &greeting;
    println!("{} and {}", r1, r2); // Valid!

    // Mutable borrow (only after immutable borrows are no longer used)
    let r3 = &mut greeting;
    r3.push_str(", World!");
    println!("{}", r3);
}`,
        explanation: "The Rust borrow checker verifies at compile-time that references cannot outlive the data they point to, eliminating null pointer dereferences and memory leaks.",
        moduleSlug: "ownership-borrowing",
        category: "rust",
        language: "rust"
    },
    {
        question: "How do Traits and Generics provide polymorphism in Rust?",
        answer: "Traits in Rust define shared behavior across types (similar to interfaces in other languages).\n\n• Generics with Trait Bounds provide **static dispatch** via monomorphization (zero runtime cost).\n• Trait Objects (`dyn Trait`) provide **dynamic dispatch** via vtables when heterogeneous types are stored together.",
        example: `pub trait Summarizable {
    fn summarize(&self) -> String;
}

pub struct NewsArticle {
    pub headline: String,
}

impl Summarizable for NewsArticle {
    fn summarize(&self) -> String {
        format!("Breaking: {}", self.headline)
    }
}

// Static dispatch with trait bound
pub fn notify<T: Summarizable>(item: &T) {
    println!("{}", item.summarize());
}`,
        explanation: "Monomorphization compiles specialized native machine code for each concrete type used with generic functions, delivering maximum runtime speed.",
        moduleSlug: "traits-generics",
        category: "rust",
        language: "rust"
    },
    {
        question: "How does Pattern Matching work with match and if let in Rust?",
        answer: "`match` in Rust provides exhaustive pattern matching. Every possible branch must be handled or the compiler rejects the code.\n\n`if let` provides ergonomic matching for single pattern branches.",
        example: `enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter(String), // Variant with inner data
}

fn value_in_cents(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter(state) => {
            println!("Quarter from state: {}", state);
            25
        }
    }
}`,
        explanation: "Rust patterns can destructure structs, tuples, and enums with compiler-enforced completeness.",
        moduleSlug: "pattern-matching",
        category: "rust",
        language: "rust"
    },
    {
        question: "What are Lifetimes in Rust and why does the compiler require lifetime annotations?",
        answer: "Lifetimes ensure that references remain valid for as long as they are referenced. The borrow checker infers most lifetimes through **lifetime elision** rules.\n\nWhen a function returns a reference derived from multiple input references, explicit lifetime annotations (`'a`) clarify which input parameter the output reference is linked to.",
        example: `// Both inputs and return reference share the lifetime 'a
fn longest<'a>(x: &'a str, y: &'a str) -> &'a str {
    if x.len() > y.len() { x } else { y }
}

fn main() {
    let s1 = String::from("long string");
    let result;
    {
        let s2 = String::from("short");
        result = longest(s1.as_str(), s2.as_str());
        println!("Longest is: {}", result);
    }
}`,
        explanation: "Lifetime annotations do not change runtime duration; they inform the compiler how references relate so it can prevent dangling pointers.",
        moduleSlug: "lifetimes",
        category: "rust",
        language: "rust"
    },
    {
        question: "How does robust Error Handling work with Result and Option in Rust?",
        answer: "Rust has no `null` or exceptions. Instead, it uses standard algebraic enums:\n\n• `Option<T>`: Represents either `Some(T)` or `None`.\n• `Result<T, E>`: Represents either `Ok(T)` or `Err(E)`.\n• The `?` operator: Ergonomic error propagation that unwraps `Ok` or immediately returns `Err`.",
        example: `use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    let mut file = File::open("username.txt")?; // '?' propagates io::Error on failure
    let mut username = String::new();
    file.read_to_string(&mut username)?;
    Ok(username)
}`,
        explanation: "The `?` operator makes error propagation clean and readable while keeping error handling explicit in the type system.",
        moduleSlug: "error-handling-resultoption",
        category: "rust",
        language: "rust"
    },
    {
        question: "What are Rust Smart Pointers (Box, Rc, RefCell, Arc)?",
        answer: "Smart pointers provide extra capabilities beyond simple references:\n\n• `Box<T>`: Allocates data on the heap (used for recursive types).\n• `Rc<T>`: Reference-counted pointer for single-threaded multiple ownership.\n• `RefCell<T>`: Implements **interior mutability**, deferring borrow checking to runtime.\n• `Arc<T>`: Atomically Reference Counted pointer for safe multi-threaded sharing.",
        example: `use std::sync::Arc;
use std::thread;

fn main() {
    // Arc allows safe sharing across threads
    let shared_data = Arc::new(vec![1, 2, 3]);

    let data_clone = Arc::clone(&shared_data);
    let handle = thread::spawn(move || {
        println!("Read from thread: {:?}", data_clone);
    });

    handle.join().unwrap();
}`,
        explanation: "`Arc<T>` combined with `Mutex<T>` enables safe concurrent state modification across multiple threads in Rust.",
        moduleSlug: "smart-pointers-box-rc-refcell",
        category: "rust",
        language: "rust"
    },
    {
        question: "How does 'Fearless Concurrency' work in Rust with Send and Sync traits?",
        answer: "Rust guarantees thread safety at compile-time via two auto traits:\n\n• `Send`: Indicates ownership of the type can be transferred across thread boundaries.\n• `Sync`: Indicates it is safe to share references to the type across multiple threads (`&T` is `Send`).\n\nIf you attempt to share a non-thread-safe type (like `Rc<T>`) across threads, the code fails to compile.",
        example: `use std::sync::{Arc, Mutex};
use std::thread;

fn main() {
    let counter = Arc::new(Mutex::new(0));
    let mut handles = vec![];

    for _ in 0..10 {
        let counter_ref = Arc::clone(&counter);
        handles.push(thread::spawn(move || {
            let mut num = counter_ref.lock().unwrap();
            *num += 1;
        }));
    }

    for handle in handles { handle.join().unwrap(); }
    println!("Result: {}", *counter.lock().unwrap()); // 10
}`,
        explanation: "Because `Mutex` unlocks automatically when its guard goes out of scope, deadlocks and unreleased mutexes are avoided.",
        moduleSlug: "concurrency-fearless-threads",
        category: "rust",
        language: "rust"
    },
    {
        question: "How do Closures work in Rust (Fn, FnMut, FnOnce)?",
        answer: "Rust closures capture variables from their enclosing environment using three traits:\n\n• `FnOnce`: Consumes captured variables (can be called once).\n• `FnMut`: Mutably borrows captured variables.\n• `Fn`: Immutably borrows captured variables.\n\nUse the `move` keyword to force transferring ownership of captured variables into the closure.",
        example: `fn main() {
    let factor = 3;
    // Implements Fn: borrows factor immutably
    let multiply = |x: i32| x * factor;
    println!("Result: {}", multiply(10)); // 30

    let mut count = 0;
    // Implements FnMut: mutates count
    let mut increment = || count += 1;
    increment();
    println!("Count: {}", count); // 1
}`,
        explanation: "The Rust compiler infers closure trait implementations automatically based on how captured variables are manipulated.",
        moduleSlug: "closures",
        category: "rust",
        language: "rust"
    },
    {
        question: "How does the module system (mod, use, crates) structure Rust applications?",
        answer: "Rust organizes code hierarchically:\n• Package: A Cargo project containing a `Cargo.toml` and one or more crates.\n• Crate: A compilation unit (binary `main.rs` or library `lib.rs`).\n• Module: Declared via `mod`, organizing privacy boundaries (`pub` vs private by default).",
        example: `// In src/network/mod.rs
pub mod client {
    pub fn connect() {
        println!("Connected to network.");
    }
}

// In src/main.rs
mod network;
use network::client;

fn main() {
    client::connect();
}`,
        explanation: "Items in Rust are private by default, enforcing strict encapsulation and explicit public interfaces.",
        moduleSlug: "modules-crates",
        category: "rust",
        language: "rust"
    },
    {
        question: "How do Iterators work in Rust and why are they zero-cost abstractions?",
        answer: "Iterators in Rust implement the `Iterator` trait with a single `next()` method. Iterator adapters (like `map`, `filter`, `fold`) are compiled down to optimized assembly identical to manual loops, with bounds checks eliminated.",
        example: `fn main() {
    let numbers = vec![1, 2, 3, 4, 5];

    // Lazy iterator chain
    let sum_of_evens: i32 = numbers
        .iter()
        .filter(|&&x| x % 2 == 0)
        .map(|&x| x * x)
        .sum();

    println!("Sum of evens squared: {}", sum_of_evens); // 4 + 16 = 20
}`,
        explanation: "Rust iterators produce zero runtime overhead because the compiler flattens and inlines the entire pipeline during optimization.",
        moduleSlug: "iterators",
        category: "rust",
        language: "rust"
    },
    {
        question: "How do Enums with Associated Data provide expressive modeling in Rust?",
        answer: "Rust enums are Algebraic Data Types (tagged unions). Unlike C-style enums that only represent integer flags, Rust enums can embed different data structures in each variant.",
        example: `enum WebEvent {
    PageLoad,
    KeyPress(char),
    Paste(String),
    Click { x: i64, y: i64 },
}

fn inspect_event(event: WebEvent) {
    match event {
        WebEvent::PageLoad => println!("Page loaded"),
        WebEvent::KeyPress(c) => println!("Key: {}", c),
        WebEvent::Paste(s) => println!("Pasted: {}", s),
        WebEvent::Click { x, y } => println!("Clicked at ({}, {})", x, y),
    }
}`,
        explanation: "Enums with associated data allow safe, strongly-typed state modeling without complex inheritance structures.",
        moduleSlug: "enums-pattern-matching",
        category: "rust",
        language: "rust"
    },
    {
        question: "What are Slices in Rust and how do they avoid memory copies?",
        answer: "A slice is a two-word reference to a contiguous sequence of elements in a collection, consisting of a pointer to the start and a length.\n\n`&str` is a string slice pointing to UTF-8 bytes, and `&[T]` is a generic array slice. They allow viewing subsections of arrays or strings without cloning.",
        example: `fn main() {
    let text = String::from("hello world");
    let word1: &str = &text[0..5];  // "hello"
    let word2: &str = &text[6..11]; // "world"

    println!("Slice 1: {}, Slice 2: {}", word1, word2);
}`,
        explanation: "Slices prevent unnecessary heap copies when passing sub-ranges to functions.",
        moduleSlug: "slices",
        category: "rust",
        language: "rust"
    },
    {
        question: "How does asynchronous programming work in Rust with async/await and Tokio?",
        answer: "In Rust, an `async fn` returns a state machine implementing the `Future` trait. Futures in Rust are **lazy**: they do nothing until polled by an asynchronous runtime like **Tokio**.",
        example: `// Requires tokio runtime in Cargo.toml
// #[tokio::main]
// async fn main() {
//     let response = fetch_data().await;
//     println!("Response: {}", response);
// }

async fn fetch_data() -> String {
    // Simulates non-blocking async wait
    "Data loaded asynchronously".to_string()
}`,
        explanation: "Because Rust futures are stack-allocated state machines that execute only when polled, they use minimal memory and incur zero runtime thread-switching penalties.",
        moduleSlug: "async-rust",
        category: "rust",
        language: "rust"
    },
    {
        question: "What are Declarative and Procedural Macros in Rust?",
        answer: "Macros enable metaprogramming (code that writes code at compile-time):\n• Declarative Macros (`macro_rules!`): Pattern-matching syntax replacements (e.g. `vec![]`, `println!`).\n• Procedural Macros: Functions that accept TokenStreams as input and output new TokenStreams (Custom Derive, Attribute, Function-like).",
        example: `// Simple declarative macro
macro_rules! say_hello {
    () => {
        println!("Hello from Rust Macro!");
    };
}

fn main() {
    say_hello!();
}`,
        explanation: "Macros expand during compilation before type checking, providing compile-time abstraction without runtime overhead.",
        moduleSlug: "macros",
        category: "rust",
        language: "rust"
    },
    {
        question: "What is Unsafe Rust and when is it necessary?",
        answer: "Unsafe Rust provides a mechanism to bypass compiler checks when interacting with hardware or calling C libraries.\n\nInside an `unsafe` block, you can:\n1. Dereference raw pointers (`*const T`, `*mut T`).\n2. Call unsafe functions or FFI routines.\n3. Implement unsafe traits.\n4. Access mutable static variables.",
        example: `fn main() {
    let mut num = 42;
    // Create raw pointers (safe to create)
    let r1 = &num as *const i32;
    
    // Dereferencing raw pointer requires unsafe block!
    unsafe {
        println!("Dereferenced raw pointer: {}", *r1);
    }
}`,
        explanation: "Unsafe Rust isolates low-level systems programming within auditable blocks, while 99% of your codebase remains provably memory-safe.",
        moduleSlug: "unsafe-rust",
        category: "rust",
        language: "rust"
    }
];
