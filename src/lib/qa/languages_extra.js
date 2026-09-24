// Languages Extra Q&A dataset: C#, C++, C, PHP, Ruby, Kotlin, Swift, Dart, HTML5, CSS3
// Covers modules with clear explanations, practical code examples, and key takeaways.

export const QA_LANGUAGES_EXTRA = [
    // ==========================================
    // C# (15 Modules)
    // ==========================================
    {
        question: "How does LINQ (Language Integrated Query) simplify data querying in C#?",
        answer: "LINQ brings declarative, SQL-like query capabilities directly into C#. It operates uniformly across collections in memory (LINQ to Objects), relational databases (LINQ to Entities / Entity Framework), and XML.\n\nLINQ uses deferred (lazy) execution: queries are not evaluated when defined, but when iterated over (`foreach`, `ToList()`, `Count()`).",
        example: `using System;
using System.Collections.Generic;
using System.Linq;

public record Employee(string Name, string Department, decimal Salary);

public class Program {
    public static void Main() {
        var staff = new List<Employee> {
            new("Alex", "IT", 95000),
            new("Bob", "Sales", 65000),
            new("Clara", "IT", 110000)
        };

        // LINQ Method Syntax with lambda expressions
        var highPaidIT = staff
            .Where(e => e.Department == "IT" && e.Salary > 90000)
            .OrderByDescending(e => e.Salary)
            .Select(e => new { e.Name, e.Salary })
            .ToList();

        foreach (var emp in highPaidIT) {
            Console.WriteLine($"{emp.Name} earns {emp.Salary:C}");
        }
    }
}`,
        explanation: "LINQ offers strong compile-time type safety and IntelliSense autocompletion, preventing runtime type mismatches in queries.",
        moduleSlug: "linq-essentials",
        category: "csharp",
        language: "csharp"
    },
    {
        question: "How do async, await, and Task operate in C# asynchronous programming?",
        answer: "Asynchronous methods in C# return `Task` or `Task<T>`. When the `await` keyword is encountered, the compiler generates an asynchronous state machine that yields the calling thread back to the thread pool while waiting for the I/O completion port.\n\nWhen the operation finishes, continuation resumes seamlessly without blocking the thread.",
        example: `using System;
using System.Net.Http;
using System.Threading.Tasks;

public class WeatherService {
    private static readonly HttpClient client = new();

    public async Task<string> GetPayloadAsync(string url) {
        try {
            // Asynchronously fetches HTTP payload without blocking calling thread
            HttpResponseMessage response = await client.GetAsync(url);
            response.EnsureSuccessStatusCode();
            return await response.Content.ReadAsStringAsync();
        } catch (HttpRequestException ex) {
            Console.WriteLine($"Network failure: {ex.Message}");
            return string.Empty;
        }
    }
}`,
        explanation: "Using `await` avoids blocking threads (`Task.Wait()` or `.Result`), maintaining high server throughput in ASP.NET Core applications.",
        moduleSlug: "asyncawait-patterns",
        category: "csharp",
        language: "csharp"
    },
    {
        question: "What is the difference between Delegates, Actions, Funcs, and Events in C#?",
        answer: "• Delegate: A type-safe function pointer referencing methods matching a specific signature.\n• `Func<T, TResult>`: Built-in generic delegate that takes parameters and returns a value.\n• `Action<T>`: Built-in generic delegate that takes parameters and returns `void`.\n• Event: A mechanism that wraps a delegate to provide publisher-subscriber encapsulation. Outside classes can only subscribe (`+=`) or unsubscribe (`-=`), but cannot invoke or clear the event directly.",
        example: `using System;

public class OrderService {
    // Declaring a strongly-typed event using Action
    public event Action<string> OnOrderPlaced;

    public void PlaceOrder(string orderId) {
        Console.WriteLine($"Order {orderId} processed.");
        // Safely invoke subscribers using null-conditional operator
        OnOrderPlaced?.Invoke(orderId);
    }
}`,
        explanation: "The `event` keyword protects delegates from being maliciously overwritten (`= null`) from outside the publishing class.",
        moduleSlug: "delegates-events",
        category: "csharp",
        language: "csharp"
    },
    {
        question: "How do Nullable Reference Types prevent NullReferenceExceptions in modern C#?",
        answer: "Introduced in C# 8, Nullable Reference Types (`#nullable enable`) differentiate between non-nullable reference types (`string`) and nullable reference types (`string?`).\n\nThe compiler produces warnings whenever a nullable variable is dereferenced without prior null checks or the null-forgiving operator (`!`).",
        example: `#nullable enable
public class UserProfile {
    public string RequiredUsername { get; set; } // Cannot be null
    public string? OptionalBio { get; set; }     // Can be null

    public UserProfile(string username) {
        RequiredUsername = username;
    }

    public void PrintBioLength() {
        // Warning if accessed directly: OptionalBio.Length
        // Safe access:
        int length = OptionalBio?.Length ?? 0;
        Console.WriteLine($"Bio characters: {length}");
    }
}`,
        explanation: "Enabling nullable reference types brings compile-time null safety to C#, preventing unexpected `NullReferenceException` crashes in production.",
        moduleSlug: "nullable-reference-types",
        category: "csharp",
        language: "csharp"
    },
    {
        question: "What are Record Types and how do they provide value equality in C#?",
        answer: "Introduced in C# 9, `record` is a reference type (or value type via `record struct`) with built-in value-based equality semantics.\n\nTwo record instances with identical property values evaluate to `true` when compared with `==`. Records also support non-destructive mutation via the `with` expression.",
        example: `public record Point(int X, int Y);

public class Program {
    public static void Main() {
        var p1 = new Point(10, 20);
        var p2 = new Point(10, 20);
        
        // Value equality (evaluates to true!)
        Console.WriteLine(p1 == p2); // True

        // Non-destructive mutation using 'with'
        var p3 = p1 with { Y = 99 };
        Console.WriteLine(p3); // Point { X = 10, Y = 99 }
    }
}`,
        explanation: "Records provide concise, immutable Domain-Driven Design (DDD) Value Objects and DTOs with zero manual equality boilerplate.",
        moduleSlug: "record-types",
        category: "csharp",
        language: "csharp"
    },

    // ==========================================
    // C++ (15 Modules)
    // ==========================================
    {
        question: "What is RAII (Resource Acquisition Is Initialization) and how do Smart Pointers manage memory in modern C++?",
        answer: "RAII is a core C++ idiom: resources (heap memory, file handles, mutex locks) are acquired in a constructor and automatically released in the destructor.\n\nModern C++ eliminates manual `new` and `delete` using standard smart pointers:\n• `std::unique_ptr`: Sole, exclusive ownership of a heap resource (cannot be copied, only moved).\n• `std::shared_ptr`: Reference-counted ownership of a heap resource.\n• `std::weak_ptr`: Non-owning reference to break circular dependencies.",
        example: `#include <iostream>
#include <memory>

class Resource {
public:
    Resource() { std::cout << "Resource acquired\\n"; }
    ~Resource() { std::cout << "Resource destroyed automatically\\n"; }
    void work() { std::cout << "Working...\\n"; }
};

int main() {
    {
        // Allocated on heap, managed by unique_ptr
        auto res = std::make_unique<Resource>();
        res->work();
    } // Out of scope: destructor called automatically here! Zero leaks!
    return 0;
}`,
        explanation: "Even if an exception is thrown inside the scope, stack unwinding guarantees that destructors run and resources are freed without leaks.",
        moduleSlug: "raii-smart-pointers",
        category: "cplusplus",
        language: "cpp"
    },
    {
        question: "How do Move Semantics and Rvalue References (&&) optimize performance in C++11?",
        answer: "Move semantics allow transferring ownership of expensive resources (like dynamically allocated buffers inside `std::vector` or `std::string`) from temporary objects (rvalues) instead of performing deep memory copies.\n\nRvalues are identified by `&&`. Calling `std::move()` casts an lvalue to an rvalue reference, triggering the move constructor.",
        example: `#include <iostream>
#include <vector>
#include <utility>

class Buffer {
public:
    std::vector<int> data;
    
    Buffer(size_t size) : data(size, 1) {}
    
    // Move constructor: steals internal pointer of temporary other
    Buffer(Buffer&& other) noexcept : data(std::move(other.data)) {
        std::cout << "Moved internal buffer efficiently without copying!\\n";
    }
};

int main() {
    Buffer b1(1000000);
    Buffer b2 = std::move(b1); // Fast pointer swap!
    return 0;
}`,
        explanation: "Move semantics turn expensive O(N) memory copies of large objects into instant O(1) pointer swaps.",
        moduleSlug: "move-semantics-rvalue-references",
        category: "cplusplus",
        language: "cpp"
    },

    // ==========================================
    // C (15 Modules)
    // ==========================================
    {
        question: "What is the difference between Pointers and Arrays in C?",
        answer: "• Array: A contiguous block of memory with a fixed size. The array identifier acts as a constant pointer to its first element (`arr == &arr[0]`), but you cannot reassign it (`arr = ptr` is invalid).\n• Pointer: A variable that stores the memory address of another variable. Pointers can be reassigned and incremented using pointer arithmetic.",
        example: `#include <stdio.h>

int main() {
    int numbers[3] = {10, 20, 30};
    int *ptr = numbers; // Decays to pointer to first element

    printf("First: %d\\n", *ptr);       // 10
    printf("Second: %d\\n", *(ptr + 1)); // 20 (Pointer arithmetic advances by sizeof(int))
    return 0;
}`,
        explanation: "Pointer arithmetic automatically scales offsets by the byte size of the underlying type (`sizeof(T)`).",
        moduleSlug: "pointers-arrays",
        category: "c",
        language: "c"
    },
    {
        question: "How do dynamic memory allocation functions (malloc, calloc, realloc, free) operate in C?",
        answer: "• `malloc(bytes)`: Allocates uninitialized memory on the heap.\n• `calloc(n, size)`: Allocates memory and zeroes out all bytes.\n• `realloc(ptr, new_size)`: Resizes an existing heap allocation.\n• `free(ptr)`: Releases allocated memory back to the heap manager.",
        example: `#include <stdio.h>
#include <stdlib.h>

int main() {
    int n = 5;
    int *arr = (int *)malloc(n * sizeof(int));
    
    if (arr == NULL) {
        fprintf(stderr, "Memory allocation failed\\n");
        return 1;
    }

    for (int i = 0; i < n; i++) arr[i] = i * 10;
    
    free(arr);   // Prevent memory leak
    arr = NULL;  // Prevent dangling pointer use
    return 0;
}`,
        explanation: "Always check for `NULL` after `malloc`, and set freed pointers to `NULL` to avoid dangerous use-after-free bugs.",
        moduleSlug: "dynamic-memory-allocation",
        category: "c",
        language: "c"
    },

    // ==========================================
    // HTML5 & CSS3
    // ==========================================
    {
        question: "Why are Semantic Elements crucial in modern HTML5 development?",
        answer: "Semantic elements (`<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<footer>`) clearly describe their meaning to both the browser, search engine crawlers, and assistive technologies (screen readers).\n\nThey replace generic `<div>` soup, improving accessibility (a11y) and SEO.",
        example: `<!DOCTYPE html>
<html lang="en">
<head><title>Semantic Layout</title></head>
<body>
  <header role="banner">
    <h1>Learna Tech Portal</h1>
    <nav role="navigation">
      <ul>
        <li><a href="/category">Browse Topics</a></li>
      </ul>
    </nav>
  </header>
  <main role="main">
    <article>
      <h2>HTML5 Semantics</h2>
      <p>Semantic tags structure document outlines for accessibility.</p>
    </article>
  </main>
  <footer>
    <p>&copy; 2026 Learna. All rights reserved.</p>
  </footer>
</body>
</html>`,
        explanation: "Screen readers announce semantic landmarks (like `<nav>` and `<main>`), allowing visually impaired users to jump directly to primary page content.",
        moduleSlug: "semantic-elements",
        category: "html5",
        language: "html"
    },
    {
        question: "How do CSS Flexbox and CSS Grid differ and when should each be used?",
        answer: "• **Flexbox (1D Layout)**: Designed for laying out items in a single dimension (either a row OR a column). Ideal for navigation bars, button groups, and centering elements.\n• **CSS Grid (2D Layout)**: Designed for two-dimensional layouts (rows AND columns simultaneously). Ideal for page templates, dashboard layouts, and complex responsive card grids.",
        example: `/* 1. Flexbox: Centering and spreading items in a row */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
}

/* 2. Grid: 2D responsive grid with auto-fitting columns */
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 1.5rem;
}`,
        explanation: "`repeat(auto-fit, minmax(280px, 1fr))` creates a fully responsive card grid without writing a single media query breakpoint.",
        moduleSlug: "flexbox-grid",
        category: "css3",
        language: "css"
    }
];
