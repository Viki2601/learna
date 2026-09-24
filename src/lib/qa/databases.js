// Q&A Database modules: SQL, PostgreSQL, MongoDB, Redis, SQLite, Firebase
// Each module contains in-depth conceptual explanations, realistic code/query examples, and key takeaways.

export const QA_DATABASES = [
  // ==========================================
  // SQL (15 Modules)
  // ==========================================
  {
    question:
      "What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN in SQL?",
    answer:
      "A JOIN clause is used to combine rows from two or more tables based on a related column between them.\n\n• INNER JOIN returns only records where there is a match in both tables.\n• LEFT JOIN (or LEFT OUTER JOIN) returns all records from the left table, and the matched records from the right table. If no match is found, NULL values are returned for right table columns.\n• RIGHT JOIN returns all records from the right table, and matched records from the left table (with NULLs for unmatched left records).\n• FULL OUTER JOIN returns all records when there is a match in either left or right table, filling with NULL wherever a side is missing.",
    example: `-- Sample Tables: Users (id, name) and Orders (id, user_id, amount)
SELECT 
    u.id AS user_id,
    u.name,
    o.id AS order_id,
    COALESCE(o.amount, 0) AS total_spent
FROM Users u
LEFT JOIN Orders o ON u.id = o.user_id
WHERE u.active = 1
ORDER BY total_spent DESC;`,
    explanation:
      "Using a LEFT JOIN guarantees that all active users appear in the result set, even if they have not placed any orders yet. For users without orders, `o.id` will be NULL and `COALESCE` gracefully falls back to 0.",
    moduleSlug: "joins-subqueries",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "How do database indexes speed up queries and what are the trade-offs of B-Tree indexing?",
    answer:
      "A database index is a data structure (predominantly a B-Tree or B+ Tree) that maintains sorted references to table rows, allowing the database engine to locate records in O(log N) time instead of performing an O(N) full table scan.\n\nWhile indexes dramatically speed up SELECT, JOIN, and ORDER BY queries, they incur overhead: every INSERT, UPDATE, or DELETE statement must also update the index trees, consuming write I/O and additional disk space. Unused or duplicate indexes degrade database write performance.",
    example: `-- Create a composite index optimized for multi-column filtering and sorting
CREATE INDEX idx_orders_customer_date 
ON orders (customer_id, order_date DESC) 
INCLUDE (total_amount);

-- Query utilizing index seek and index-only scan
SELECT customer_id, order_date, total_amount
FROM orders
WHERE customer_id = 4520 
  AND order_date >= '2026-01-01'
ORDER BY order_date DESC;`,
    explanation:
      "Because the index contains `customer_id` first and `order_date` second (matching the query's WHERE and ORDER BY clauses), the query engine can perform a fast index seek without sorting in memory. The `INCLUDE` clause avoids visiting the base table completely (covering index).",
    moduleSlug: "indexing-query-optimization",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "How does WHERE filtering differ from HAVING filtering in SQL aggregate queries?",
    answer:
      "The WHERE clause filters individual rows before any groupings or aggregate calculations take place. In contrast, the HAVING clause filters groups after the GROUP BY clause and aggregate calculations (like COUNT, SUM, AVG) have been evaluated.\n\nYou cannot use aggregate functions directly in a WHERE clause (e.g., WHERE SUM(amount) > 100 is invalid), because individual rows do not have an aggregated sum until grouped.",
    example: `SELECT 
    department_id,
    COUNT(employee_id) AS total_staff,
    AVG(salary) AS avg_department_salary
FROM employees
WHERE employment_status = 'Active' -- Filters rows before grouping
GROUP BY department_id
HAVING COUNT(employee_id) >= 5     -- Filters groups after aggregation
   AND AVG(salary) > 75000;`,
    explanation:
      "Here, inactive employees are removed before grouping by `department_id`. The engine then computes total employees and average salary per department, and HAVING filters out departments with fewer than 5 members or an average salary of $75,000 or below.",
    moduleSlug: "basic-queries-filtering",
    category: "sql",
    language: "sql",
  },
  {
    question: "How do aggregate functions work with GROUP BY in SQL?",
    answer:
      "Aggregate functions compute a single summary value across a set of rows. When paired with `GROUP BY`, the engine divides the table into distinct buckets based on unique values of the grouped columns, and calculates the aggregate independently for each group.\n\nEvery non-aggregated column in the `SELECT` list must be explicitly included in the `GROUP BY` clause.",
    example: `SELECT 
    category,
    COUNT(*) AS total_items,
    ROUND(AVG(price), 2) AS average_price,
    MAX(price) AS highest_price,
    MIN(price) AS lowest_price
FROM products
WHERE in_stock = 1
GROUP BY category
ORDER BY total_items DESC;`,
    explanation:
      "Rows are grouped by `category`. For each category, SQL calculates the count, average price rounded to two decimals, and the maximum and minimum price.",
    moduleSlug: "aggregate-functions-group-by",
    category: "sql",
    language: "sql",
  },
  {
    question: "What is database normalization and what are 1NF, 2NF, and 3NF?",
    answer:
      "Normalization is the process of structuring a relational database schema to reduce data redundancy, prevent update anomalies, and improve data integrity.\n\n• 1NF (First Normal Form): Every column contains atomic (indivisible) values, each record is unique, and no repeating groups exist.\n• 2NF (Second Normal Form): Meets 1NF, and all non-key attributes are fully functionally dependent on the entire primary key (no partial key dependencies).\n• 3NF (Third Normal Form): Meets 2NF, and non-key attributes are not transitively dependent on the primary key (no non-key attribute depends on another non-key attribute).",
    example: `-- 3NF Design: Separating Customers and Orders to eliminate redundancy
CREATE TABLE Customers (
    customer_id INT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL
);

CREATE TABLE Orders (
    order_id INT PRIMARY KEY,
    customer_id INT REFERENCES Customers(customer_id),
    order_date DATE NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL
);`,
    explanation:
      "By keeping customer details in `Customers` and referencing `customer_id` from `Orders`, changing a customer's email only requires updating one row instead of thousands of past order rows.",
    moduleSlug: "normalization",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What are SQL Window Functions and how does the OVER (PARTITION BY ... ORDER BY ...) clause work?",
    answer:
      "Window functions perform calculations across a set of table rows related to the current row without collapsing them into a single row like `GROUP BY` does. Each row in the original query retains its identity while having access to aggregated or ranked information across its 'window'.\n\n`PARTITION BY` defines how rows are grouped into windows, and `ORDER BY` defines the sequence of rows within each partition for ranking or running totals.",
    example: `SELECT 
    employee_id,
    department_id,
    salary,
    -- Rank employee within their department by salary
    DENSE_RANK() OVER (
        PARTITION BY department_id 
        ORDER BY salary DESC
    ) AS dept_salary_rank,
    -- Running total of salary within department
    SUM(salary) OVER (
        PARTITION BY department_id 
        ORDER BY hire_date
    ) AS running_dept_payroll
FROM employees;`,
    explanation:
      "Unlike a `GROUP BY` query which reduces all department rows to one, window functions allow you to print every employee alongside their relative department salary rank and cumulative payroll up to their hire date.",
    moduleSlug: "window-functions",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What are ACID properties in database transactions and how do they ensure reliability?",
    answer:
      "ACID is a set of four guarantees that database engines implement to ensure transactions execute reliably:\n\n• Atomicity: 'All or nothing'. If any statement in a transaction fails, all previously executed modifications are rolled back.\n• Consistency: A transaction transforms the database from one valid state to another, strictly honoring all constraints, foreign keys, and triggers.\n• Isolation: Concurrent transactions execute without interfering with one another or seeing intermediate, uncommitted states.\n• Durability: Once a transaction commits, its changes survive system crashes and power outages, typically via Write-Ahead Logging (WAL).",
    example: `BEGIN TRANSACTION;

-- Debit from account A
UPDATE Accounts 
SET balance = balance - 500.00 
WHERE account_id = 101 AND balance >= 500.00;

-- Credit to account B
UPDATE Accounts 
SET balance = balance + 500.00 
WHERE account_id = 202;

-- Check balance integrity before persisting
IF @@ROWCOUNT = 1
    COMMIT TRANSACTION;
ELSE
    ROLLBACK TRANSACTION;`,
    explanation:
      "If money is deducted from Account 101 but the credit to Account 202 fails, the entire transaction is rolled back, guaranteeing that money is never lost or created out of thin air.",
    moduleSlug: "transactions-acid",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What is a SQL View and when should you use standard vs materialized views?",
    answer:
      "A View is a virtual table defined by a stored SELECT query. It contains no stored data itself; every time a view is queried, the database executes the underlying query.\n\n• Standard Views simplify complex queries, encapsulate business logic, and restrict column access for security.\n• Materialized Views physically persist the query result to disk and can be indexed, delivering high read performance for expensive analytical queries at the expense of needing periodic refreshes.",
    example: `-- Create a standard view for active customer summaries
CREATE VIEW v_active_customer_orders AS
SELECT 
    c.customer_id,
    c.name,
    COUNT(o.order_id) AS total_orders,
    COALESCE(SUM(o.total_amount), 0) AS lifetime_value
FROM Customers c
LEFT JOIN Orders o ON c.customer_id = o.customer_id
WHERE c.is_active = TRUE
GROUP BY c.customer_id, c.name;

-- Query the view just like a regular table
SELECT * FROM v_active_customer_orders WHERE lifetime_value > 1000;`,
    explanation:
      "Applications can query `v_active_customer_orders` directly without writing complex multi-table joins repeatedly, standardizing the definition of lifetime value across all reports.",
    moduleSlug: "views",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What are Stored Procedures and Triggers, and when should you avoid them?",
    answer:
      "A Stored Procedure is a prepared set of SQL statements and control logic compiled and stored on the database server, executed on demand via `CALL`.\n\nA Trigger is code automatically executed by the database engine in response to specific DML events (`INSERT`, `UPDATE`, or `DELETE`) on a table.\n\nWhile they reduce network round-trips and enforce strict constraints, overuse creates hidden business logic that is difficult to version control, debug, unit test, and scale horizontally across application servers.",
    example: `-- Trigger that automatically logs price adjustments
CREATE TRIGGER trg_audit_price_change
AFTER UPDATE OF price ON products
FOR EACH ROW
WHEN (OLD.price IS DISTINCT FROM NEW.price)
BEGIN
    INSERT INTO ProductPriceAudit (product_id, old_price, new_price, changed_at)
    VALUES (NEW.id, OLD.price, NEW.price, NOW());
END;`,
    explanation:
      "Every time a product's price is updated, this trigger automatically records the historical price change into the audit table, ensuring tamper-proof compliance regardless of which service triggered the update.",
    moduleSlug: "stored-procedures-triggers",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What is a Common Table Expression (CTE) and how does a recursive CTE work?",
    answer:
      "A Common Table Expression (CTE) is a temporary, named result set defined using the `WITH` clause that exists only during the execution of a single query. It improves readability and maintainability over nested subqueries.\n\nA Recursive CTE references itself and is ideal for traversing hierarchical data like organizational charts, parent-child trees, and bill of materials.",
    example: `-- Recursive CTE to traverse an employee hierarchy
WITH RECURSIVE OrgChart AS (
    -- Anchor member: Start with top CEO (manager_id is NULL)
    SELECT employee_id, name, manager_id, 1 AS level
    FROM Employees
    WHERE manager_id IS NULL
    
    UNION ALL
    
    -- Recursive member: Find direct reports
    SELECT e.employee_id, e.name, e.manager_id, o.level + 1
    FROM Employees e
    INNER JOIN OrgChart o ON e.manager_id = o.employee_id
)
SELECT level, name FROM OrgChart ORDER BY level, name;`,
    explanation:
      "The anchor query finds the company CEO. The recursive member joins against the previous output to find reports at level 2, then level 3, until no more subordinates are found.",
    moduleSlug: "ctes-common-table-expressions",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What are PRIMARY KEY, FOREIGN KEY, and UNIQUE constraints in SQL?",
    answer:
      "Constraints enforce rules on data in a table to ensure data integrity:\n\n• PRIMARY KEY uniquely identifies each record in a table. It cannot contain NULL values, and each table can have only one primary key (which can consist of multiple columns).\n• UNIQUE constraint ensures all values in a column or set of columns are distinct, but unlike primary keys, allows NULLs (in most dialects, one or multiple NULLs).\n• FOREIGN KEY creates a relationship linking a column to the primary or unique key of another table, preventing orphaned records and enforcing referential integrity.",
    example: `CREATE TABLE Users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE Profiles (
    user_id INT PRIMARY KEY,
    bio TEXT,
    CONSTRAINT fk_profile_user 
        FOREIGN KEY (user_id) 
        REFERENCES Users(id) 
        ON DELETE CASCADE
);`,
    explanation:
      "The `ON DELETE CASCADE` rule guarantees that if a row in `Users` is deleted, the corresponding profile in `Profiles` is automatically cleaned up by the engine.",
    moduleSlug: "constraints-pkfkunique",
    category: "sql",
    language: "sql",
  },
  {
    question: "What is the difference between UNION and UNION ALL in SQL?",
    answer:
      "Both `UNION` and `UNION ALL` combine the result sets of two or more `SELECT` queries into a single result set with the same column count and compatible types.\n\n• `UNION` removes duplicate rows from the final result set by performing an implicit sorting/hash distinct operation, which can be computationally expensive.\n• `UNION ALL` preserves all rows, including duplicates, without sorting. It is substantially faster and should always be preferred when results are known to be mutually exclusive or when duplicates are desirable.",
    example: `-- Combining archived orders and active orders efficiently
SELECT order_id, customer_id, total, 'Active' AS status 
FROM ActiveOrders
UNION ALL
SELECT order_id, customer_id, total, 'Archived' AS status 
FROM ArchivedOrders;`,
    explanation:
      "Because an order is either active or archived (never both), duplicates are impossible, making `UNION ALL` much more efficient by avoiding a pointless in-memory deduplication sort.",
    moduleSlug: "set-operations-unionintersect",
    category: "sql",
    language: "sql",
  },
  {
    question: "How do you read and interpret a SQL Query Execution Plan?",
    answer:
      "An Execution Plan is the sequence of operations chosen by the database query optimizer to execute a SQL statement. You inspect it using `EXPLAIN` or `EXPLAIN ANALYZE`.\n\nKey components to look for:\n1. Scan Type: 'Index Scan' or 'Index Seek' is fast; 'Seq Scan' or 'Table Scan' checks every row.\n2. Cost / Time: Optimizer estimate vs actual execution time.\n3. Rows: Estimated rows vs actual rows returned (a large discrepancy indicates stale table statistics).\n4. Joins: Nested Loop (good for small sets with index), Hash Join (good for large unindexed sets), or Merge Join (good for presorted sets).",
    example: `-- Inspect actual runtime execution metrics in PostgreSQL
EXPLAIN ANALYZE
SELECT u.name, o.total_amount
FROM Users u
JOIN Orders o ON u.id = o.user_id
WHERE o.created_at >= '2026-01-01'
  AND u.status = 'VIP';`,
    explanation:
      "Reading the tree output from innermost to outermost reveals bottlenecks: for example, if the engine performed a full table scan on `Orders` instead of using an index on `created_at`.",
    moduleSlug: "query-execution-plans",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What is database locking and how do Shared vs Exclusive locks prevent race conditions?",
    answer:
      "Locking is a concurrency control mechanism that prevents concurrent transactions from corrupting shared data.\n\n• Shared Lock (S): Acquired during read operations. Multiple transactions can hold shared locks on the same resource concurrently to read data, but no write is allowed.\n• Exclusive Lock (X): Acquired during write operations (`UPDATE`, `DELETE`, `INSERT`). Only one transaction can hold an exclusive lock; all other reads and writes are blocked until it releases.\n\nDeadlocks occur when two transactions hold locks and each waits for the other to release, which the engine resolves by aborting one transaction.",
    example: `-- Pessimistic Locking: Prevent race conditions when reserving limited stock
BEGIN;

SELECT inventory_count 
FROM Products 
WHERE product_id = 999 
FOR UPDATE; -- Acquires an Exclusive lock on this specific row

-- Safe from concurrent checkouts
UPDATE Products 
SET inventory_count = inventory_count - 1 
WHERE product_id = 999;

COMMIT;`,
    explanation:
      "`SELECT ... FOR UPDATE` acquires an exclusive lock on product 999 immediately. Any concurrent checkout attempt will pause until this transaction commits, eliminating inventory over-selling.",
    moduleSlug: "locking-concurrency",
    category: "sql",
    language: "sql",
  },
  {
    question:
      "What are the core principles of good relational database schema design?",
    answer:
      "Effective database design requires balancing data integrity, normalization, and query performance:\n\n1. Use appropriate data types (e.g. `TIMESTAMPTZ` for dates, `INT` or `BIGINT` for keys, `VARCHAR(n)` instead of arbitrary length).\n2. Enforce primary keys on every table and use foreign keys to maintain referential integrity.\n3. Normalize to 3NF to avoid redundancy, then denormalize selectively for heavy read workloads.\n4. Design naming conventions consistently (e.g., snake_case, singular vs plural table names).\n5. Plan indexing strategies around actual application query patterns.",
    example: `-- Production-grade user entity schema
CREATE TABLE users (
    id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    uuid UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP NOT NULL
);

CREATE INDEX idx_users_created_at ON users (created_at DESC);`,
    explanation:
      "Using an internal numeric `id` provides compact, fast B-Tree indexing for foreign key joins, while public APIs expose the opaque `uuid` to avoid exposing auto-incrementing sequential customer counts.",
    moduleSlug: "database-design-basics",
    category: "sql",
    language: "sql",
  },

  // ==========================================
  // POSTGRESQL (15 Modules)
  // ==========================================
  {
    question:
      "What indexing strategies does PostgreSQL offer beyond standard B-Tree indexes?",
    answer:
      "PostgreSQL provides specialized index types tailored to diverse data structures:\n\n• B-Tree: Default index for comparisons (<, <=, =, >=, >) and sort operations.\n• GIN (Generalized Inverted Index): Best for composite items containing multiple values, such as JSONB, Arrays, and Full-Text Search vectors.\n• GiST (Generalized Search Tree): Ideal for geometric, range types, and nearest-neighbor search.\n• BRIN (Block Range Index): Extremely compact indexes for massive tables where column values correlate with physical disk storage (e.g., sequential timestamps).",
    example: `-- Create a GIN index on a JSONB metadata column for instant sub-document querying
CREATE INDEX idx_products_specs ON products USING gin (specifications);

-- Extremely fast lookup using the containment operator (@>)
SELECT id, title 
FROM products 
WHERE specifications @> '{"color": "Graphite", "ram_gb": 32}';`,
    explanation:
      "The GIN index breaks the JSONB document into constituent keys and values, allowing PostgreSQL to locate documents matching multiple sub-criteria without parsing JSON rows individually.",
    moduleSlug: "indexes-performance",
    category: "postgresql",
    language: "sql",
  },
  {
    question: "What is the difference between JSON and JSONB in PostgreSQL?",
    answer:
      "• `JSON` stores an exact textual representation of the JSON input. It preserves whitespace, object key order, and duplicate keys, but must be reparsed every single time it is queried.\n• `JSONB` stores JSON in a decomposed binary format. It strips insignificant whitespace, eliminates duplicate keys, does not preserve key order, but is substantially faster to process and supports GIN indexing.\n\nIn almost all modern production applications, `JSONB` is the recommended choice.",
    example: `-- Querying and manipulating JSONB
SELECT 
    id,
    metadata->>'company' AS company_name,                -- Extract as text (->>)
    (metadata->'features'->0)::text AS primary_feature,  -- Array indexing
    metadata || '{"last_verified": "2026-03-01"}'::jsonb AS merged_json -- Concat update
FROM customers
WHERE metadata ? 'verified_badge'; -- Key existence check (?)`,
    explanation:
      "`->` returns a JSON object, while `->>` extracts the value directly as SQL `text`. The `?` operator performs an indexed check to see if a top-level key exists.",
    moduleSlug: "jsonb-arrays",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How does the UPSERT feature work in PostgreSQL using ON CONFLICT?",
    answer:
      "PostgreSQL provides the `ON CONFLICT` clause on `INSERT` statements to perform atomic 'upserts' (insert if absent, update if present) without application-level race conditions.\n\nYou specify the target conflict constraint (usually a column with a UNIQUE index or primary key), and define either `DO NOTHING` or `DO UPDATE SET`.",
    example: `INSERT INTO user_preferences (user_id, theme, notifications_enabled, updated_at)
VALUES (42, 'dark', true, NOW())
ON CONFLICT (user_id) 
DO UPDATE SET 
    theme = EXCLUDED.theme,
    notifications_enabled = EXCLUDED.notifications_enabled,
    updated_at = NOW();`,
    explanation:
      "The special `EXCLUDED` table holds the proposed values from the failed INSERT. If user 42 already exists, PostgreSQL automatically updates the existing row with the incoming values.",
    moduleSlug: "basic-crud-operations",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "What are the four transaction isolation levels in PostgreSQL and what anomalies do they prevent?",
    answer:
      "PostgreSQL provides four isolation levels:\n1. Read Uncommitted: Treated identically to Read Committed in Postgres; dirty reads are never permitted.\n2. Read Committed (default): Statements only see data committed before the statement began.\n3. Repeatable Read: Transactions only see data committed before the entire transaction began; prevents Non-Repeatable Reads and Phantom Reads.\n4. Serializable: Strictest level. Uses Serializable Snapshot Isolation (SSI) to guarantee transactions execute as if strictly serial, aborting transactions with serialization failures.",
    example: `-- Running a critical reconciliation at Serializable isolation
BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE;

SELECT balance FROM accounts WHERE id = 1;
-- Perform stateful business checks
UPDATE accounts SET balance = balance - 100 WHERE id = 1;

COMMIT; -- Will automatically rollback with a 40001 error if serialization conflict occurs`,
    explanation:
      "Serializable isolation guarantees complete freedom from write skew and phantom reads. Applications must be prepared to catch serialization errors and retry the transaction.",
    moduleSlug: "transactions-isolation-levels",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "What is a Materialized View in PostgreSQL and how do you refresh it concurrently?",
    answer:
      "A Materialized View executes an expensive query and persists the result set as a physical table on disk, which can have its own indexes for blazing-fast reads.\n\nHowever, data becomes stale until refreshed. Using `REFRESH MATERIALIZED VIEW CONCURRENTLY` updates the view without acquiring exclusive read locks, allowing users to continue querying old data while the refresh completes.",
    example: `-- Define materialized view for monthly billing metrics
CREATE MATERIALIZED VIEW mv_monthly_revenue AS
SELECT 
    date_trunc('month', created_at) AS month,
    COUNT(id) AS total_invoices,
    SUM(amount) AS gross_revenue
FROM Invoices
WHERE status = 'PAID'
GROUP BY 1;

-- Unique index is REQUIRED for CONCURRENT refresh
CREATE UNIQUE INDEX idx_mv_revenue_month ON mv_monthly_revenue (month);

-- Refresh in background without blocking reads
REFRESH MATERIALIZED VIEW CONCURRENTLY mv_monthly_revenue;`,
    explanation:
      "A unique index on the materialized view is mandatory for `CONCURRENTLY`. Postgres creates a temporary copy, computes the delta, and updates the rows in place without locking out readers.",
    moduleSlug: "views-materialized-views",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How do PL/pgSQL Triggers and Trigger Functions work in PostgreSQL?",
    answer:
      "In PostgreSQL, creating a trigger is a two-step process:\n1. Write a reusable Trigger Function that returns type `trigger` and uses special internal variables like `NEW`, `OLD`, and `TG_OP`.\n2. Bind the trigger to a table using `CREATE TRIGGER`, specifying the execution timing (`BEFORE` or `AFTER`) and scope (`FOR EACH ROW` or `FOR EACH STATEMENT`).",
    example: `-- 1. Define the trigger function
CREATE OR REPLACE FUNCTION update_timestamp_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW; -- For BEFORE triggers, returning NEW applies modifications
END;
$$ LANGUAGE plpgsql;

-- 2. Bind the trigger to the table
CREATE TRIGGER set_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp_column();`,
    explanation:
      "A `BEFORE UPDATE` trigger function intercepts the incoming `NEW` record, attaches the current server timestamp to `updated_at`, and returns it so Postgres writes the updated timestamp automatically.",
    moduleSlug: "triggers-functions",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How does table partitioning work in PostgreSQL using Declarative Partitioning?",
    answer:
      "Declarative Partitioning splits one logically massive table into smaller physical tables (partitions) based on a partition key (such as Range, List, or Hash).\n\nThis dramatically improves query performance through 'partition pruning' (the planner skips scanning irrelevant partitions entirely) and allows instant data purging via `DROP TABLE partition_name` instead of expensive mass `DELETE` queries.",
    example: `-- Create master partitioned table by range (Year)
CREATE TABLE metrics (
    id BIGINT,
    recorded_at TIMESTAMPTZ NOT NULL,
    cpu_usage NUMERIC
) PARTITION BY RANGE (recorded_at);

-- Create individual year partitions
CREATE TABLE metrics_2025 PARTITION OF metrics
    FOR VALUES FROM ('2025-01-01') TO ('2026-01-01');

CREATE TABLE metrics_2026 PARTITION OF metrics
    FOR VALUES FROM ('2026-01-01') TO ('2027-01-01');`,
    explanation:
      "Queries filtering by `recorded_at >= '2026-06-01'` automatically prune `metrics_2025` from disk reading, speeding up query execution by half and keeping working memory focused on recent data.",
    moduleSlug: "partitioning",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How does Full-Text Search work in PostgreSQL using tsvector and tsquery?",
    answer:
      "PostgreSQL provides built-in search engine capabilities without needing external services like Elasticsearch for simple to medium workloads.\n\n• `to_tsvector`: Parses a string into a list of normalized, lexically stemmed tokens (lexemes).\n• `to_tsquery`: Parses a search query with boolean operators (`&`, `|`, `!`, `<->` for proximity).\n• The `@@` operator matches a vector against a query.",
    example: `-- Full text search with ranking
SELECT 
    title,
    ts_rank(to_tsvector('english', content), query) AS relevance
FROM articles, 
     to_tsquery('english', 'database & (optimization | scaling)') query
WHERE to_tsvector('english', content) @@ query
ORDER BY relevance DESC
LIMIT 10;`,
    explanation:
      "Stemming ensures that searching for 'optimization' also matches 'optimizing' and 'optimized'. Pre-computing `tsvector` columns with GIN indexes makes searches sub-millisecond.",
    moduleSlug: "full-text-search",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How do window functions like LAG, LEAD, and NTILE operate in PostgreSQL?",
    answer:
      "PostgreSQL provides advanced analytic window functions:\n• `LAG(col, offset)`: Retrieves a value from a previous row in the partition.\n• `LEAD(col, offset)`: Retrieves a value from a subsequent row in the partition.\n• `NTILE(n)`: Divides the rows of each partition into `n` approximately equal buckets.",
    example: `SELECT 
    stock_ticker,
    trading_date,
    close_price,
    -- Get yesterday's closing price
    LAG(close_price, 1) OVER (PARTITION BY stock_ticker ORDER BY trading_date) AS prev_close,
    -- Calculate day-over-day price change
    close_price - LAG(close_price, 1) OVER (PARTITION BY stock_ticker ORDER BY trading_date) AS price_change
FROM stock_prices;`,
    explanation:
      "`LAG(close_price, 1)` pulls the previous trading day's price, allowing inline calculation of daily stock gains and losses without joining the table against itself.",
    moduleSlug: "window-functions",
    category: "postgresql",
    language: "sql",
  },
  {
    question: "What is physical vs logical replication in PostgreSQL?",
    answer:
      "• Physical Replication (Streaming Replication): Copies byte-for-byte WAL records from the primary server to standby replicas. It replicates the entire cluster verbatim and standby nodes are read-only.\n• Logical Replication: Replicates data changes at the logical row level using a publish-subscribe model. You can replicate specific tables, write to target replicas, replicate between different PostgreSQL major versions, or consolidate multiple databases into one.",
    example: `-- On Primary (Publisher):
CREATE PUBLICATION customer_sync FOR TABLE customers, orders;

-- On Remote Subscriber:
CREATE SUBSCRIPTION customer_receiver 
CONNECTION 'host=primary.internal dbname=app user=replicator password=secret' 
PUBLICATION customer_sync;`,
    explanation:
      "Logical replication allows microservices or analytical databases to stream specific table updates in real-time across different database versions without full database cloning.",
    moduleSlug: "replication-basics",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How do Foreign Key constraints with DEFERRABLE work in PostgreSQL?",
    answer:
      "By default, foreign keys are checked immediately after each SQL statement runs. If an operation temporarily violates referential integrity during a multi-row insert or cyclic dependency, the statement immediately fails.\n\nDeclaring a constraint `DEFERRABLE INITIALLY DEFERRED` postpones the foreign key check until the very end of the transaction (`COMMIT`), enabling complex circular data loading.",
    example: `CREATE TABLE nodes (
    node_id INT PRIMARY KEY,
    parent_id INT,
    CONSTRAINT fk_parent 
        FOREIGN KEY (parent_id) 
        REFERENCES nodes(node_id) 
        DEFERRABLE INITIALLY DEFERRED
);

BEGIN;
-- Both nodes can reference each other before both rows are created
INSERT INTO nodes (node_id, parent_id) VALUES (1, 2);
INSERT INTO nodes (node_id, parent_id) VALUES (2, 1);
COMMIT; -- Foreign keys validated here; passes successfully!`,
    explanation:
      "Because foreign key validation is deferred until `COMMIT`, temporary circular relationships between node 1 and node 2 do not abort the transaction.",
    moduleSlug: "constraints-foreign-keys",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "How do you analyze PostgreSQL execution plans with EXPLAIN (ANALYZE, BUFFERS)?",
    answer:
      "`EXPLAIN ANALYZE` executes the query and returns actual wall-clock timing alongside planner estimates. Adding the `BUFFERS` option displays how many 8KB pages were read from the PostgreSQL shared buffer cache (`shared hit`) versus fetched from OS disk storage (`shared read`).\n\nHigh `shared read` indicates cache misses and high disk I/O, signifying missing indexes or inadequate shared memory allocation.",
    example: `EXPLAIN (ANALYZE, BUFFERS, TIMING OFF)
SELECT * FROM users 
WHERE email = 'alex@example.com';

-- Sample Output:
-- Index Scan using idx_users_email on users (cost=0.29..8.30 rows=1 width=128)
--   (actual rows=1 loops=1)
--   Index Cond: (email = 'alex@example.com')
--   Buffers: shared hit=3`,
    explanation:
      "`shared hit=3` means only 3 memory pages were inspected directly from RAM, with zero disk reads. This confirms optimal index performance.",
    moduleSlug: "explain-analyze",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "What are PostgreSQL Extensions and how do you install and use PostGIS?",
    answer:
      "Extensions package extra SQL functions, data types, and index operators that seamlessly integrate into the PostgreSQL engine core.\n\nPostGIS is the industry-standard spatial extension, providing GIS geometry types (Points, Polygons), spatial indexes (R-Tree / GiST), and geographic calculation functions (distance, intersection, containment).",
    example: `-- Enable the spatial extension
CREATE EXTENSION IF NOT EXISTS postgis;

-- Create table with geographic coordinates
CREATE TABLE stores (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100),
    location GEOGRAPHY(Point, 4326)
);

-- Find stores within 5 kilometers of coordinates
SELECT name 
FROM stores 
WHERE ST_DWithin(location, ST_MakePoint(-73.985, 40.748)::geography, 5000);`,
    explanation:
      "`ST_DWithin` calculates real-world geodesic distances in meters on the Earth's spheroid using spatial indexes, without requiring flat-plane cartesian approximations.",
    moduleSlug: "extensions-postgis-etc",
    category: "postgresql",
    language: "sql",
  },
  {
    question:
      "Why is Connection Pooling essential for PostgreSQL and how does PgBouncer help?",
    answer:
      "PostgreSQL uses a process-based connection architecture: each connected client forks a distinct backend OS process, consuming roughly 5–10 MB of RAM plus connection overhead. Allowing thousands of direct connections degrades performance due to CPU context switching and lock contention.\n\nA connection pooler like **PgBouncer** sits between application servers and Postgres, maintaining a small pool of persistent backend database connections and reusing them across thousands of ephemeral client requests.",
    example: `# PgBouncer configuration (pgbouncer.ini)
[databases]
app_db = host=127.0.0.1 port=5432 dbname=production

[pgbouncer]
listen_port = 6432
listen_addr = *
auth_type = md5
pool_mode = transaction # Connections returned to pool after each transaction
max_client_conn = 5000  # Thousands of app connections
default_pool_size = 25  # Only 25 actual Postgres backend processes!`,
    explanation:
      "Under `transaction` pool mode, application microservices can open thousands of idle connections without bogging down Postgres. Only actively executing transactions lease a physical database backend.",
    moduleSlug: "connection-pooling",
    category: "postgresql",
    language: "ini",
  },
  {
    question:
      "How do backup and restore work in PostgreSQL using pg_dump and Point-in-Time Recovery (PITR)?",
    answer:
      "PostgreSQL offers two complementary backup approaches:\n\n1. Logical Backups (`pg_dump` / `pg_restore`): Dumps SQL schema and data as portable scripts or custom compressed files. Ideal for migrations and smaller databases.\n2. Physical Backups + WAL Archiving (PITR): Backs up raw database cluster files (`pg_basebackup`) combined with continuously archived WAL logs. Enables restoration to an exact historical microsecond in time before an incident occurred.",
    example: `-- 1. Create a custom-format compressed backup
pg_dump -h localhost -U postgres -F c -b -v -f prod_backup.dump mydatabase

-- 2. Restore in parallel across 4 CPU cores
pg_restore -h localhost -U postgres -d newdatabase -j 4 prod_backup.dump`,
    explanation:
      "Custom format (`-F c`) is flexible because `pg_restore` can selectively filter tables, run multi-threaded parallel restores (`-j`), and reorder index creation after table inserts finish.",
    moduleSlug: "backup-restore",
    category: "postgresql",
    language: "bash",
  },

  // ==========================================
  // MONGODB (15 Modules)
  // ==========================================
  {
    question:
      "What is the document model in MongoDB and how do BSON and Collections work?",
    answer:
      "MongoDB is a document-oriented NoSQL database that stores data as JSON-like documents formatted internally as **BSON** (Binary JSON). BSON extends JSON with additional data types such as `ObjectId`, `Date`, `Decimal128`, and raw binary buffers.\n\nDocuments are grouped into **Collections** (analogous to tables in SQL). Unlike relational tables, collections do not enforce fixed column structures; documents in the same collection can have distinct fields (polymorphic schema).",
    example: `// MongoDB document in the "users" collection
{
  "_id": ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"),
  "name": "Jane Doe",
  "email": "jane@example.com",
  "tags": ["developer", "admin"],
  "profile": {
    "age": 29,
    "github": "janedoe"
  },
  "created_at": ISODate("2026-01-15T10:30:00Z")
}`,
    explanation:
      "BSON documents allow deep nesting of objects and arrays, meaning related information (like tags and profile details) can be stored within a single document, avoiding relational joins.",
    moduleSlug: "documents-collections",
    category: "mongodb",
    language: "javascript",
  },
  {
    question: "How does the MongoDB Aggregation Pipeline work?",
    answer:
      "The Aggregation Pipeline is a multi-stage framework for data transformation and analytics in MongoDB. Documents pass through sequential stages that filter, group, project, sort, and reshape the data stream.\n\nCommon stages include:\n• `$match`: Filters documents (analogous to SQL WHERE).\n• `$group`: Aggregates values by a specified key (analogous to SQL GROUP BY).\n• `$project`: Reshapes document fields (analogous to SQL SELECT).\n• `$unwind`: Deconstructs an array field into individual documents.\n• `$lookup`: Performs left outer joins to another collection.",
    example: `db.orders.aggregate([
  // Stage 1: Filter to completed orders from 2026
  { $match: { status: "COMPLETED", orderDate: { $gte: new Date("2026-01-01") } } },
  
  // Stage 2: Group by customerId and sum their spending
  { 
    $group: {
      _id: "$customerId",
      totalSpent: { $sum: "$totalAmount" },
      orderCount: { $sum: 1 }
    }
  },
  
  // Stage 3: Keep only high-value customers
  { $match: { totalSpent: { $gte: 1000 } } },
  
  // Stage 4: Sort descending by total revenue
  { $sort: { totalSpent: -1 } }
]);`,
    explanation:
      "Each stage takes the output of the preceding stage. Memory is optimized because filtering occurs early in the pipeline via `$match`.",
    moduleSlug: "aggregation-pipeline",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "What types of indexes does MongoDB support and how do Compound Indexes work?",
    answer:
      "MongoDB supports single-field indexes, compound indexes, multikey indexes (for arrays), text indexes, geospatial indexes, and TTL (time-to-live) indexes.\n\nA **Compound Index** indexes multiple fields together. Query performance follows the **Equality, Sort, Range (ESR)** rule: place exact equality fields first, sorting fields second, and range filters last.",
    example: `// Create a compound index on tenantId (equality), status (equality), and createdAt (range/sort)
db.tickets.createIndex(
  { tenantId: 1, status: 1, createdAt: -1 },
  { name: "idx_tenant_status_date" }
);

// This query performs a fast index seek without sorting in RAM:
db.tickets.find({ 
  tenantId: "org_123", 
  status: "OPEN",
  createdAt: { $gte: new Date("2026-01-01") }
}).sort({ createdAt: -1 });`,
    explanation:
      "By structuring the index following ESR, MongoDB evaluates the query purely through B-Tree traversal and returns rows already in the desired sort order.",
    moduleSlug: "indexing-strategies",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "How do atomic update operators like $set, $inc, and $push work in MongoDB?",
    answer:
      "MongoDB performs updates at the document level atomically. Rather than fetching, modifying in application memory, and saving the whole document (which risks lost updates from concurrent writes), you send atomic update operators directly to the database.\n\n• `$set`: Overwrites specific fields without touching other keys.\n• `$inc`: Increments a numeric value atomically.\n• `$push`: Appends an element to an array.\n• `$pull`: Removes matching items from an array.",
    example: `db.products.updateOne(
  { _id: ObjectId("64f1a2b3c4d5e6f7a8b9c0d1"), stock: { $gte: 1 } },
  {
    $inc: { stock: -1, salesCount: 1 },
    $push: { auditLog: { action: "SALE", timestamp: new Date() } },
    $set: { lastModified: new Date() }
  }
);`,
    explanation:
      "The query condition `{ stock: { $gte: 1 } }` acts as a guard. If another concurrent request already bought the last item, the query matches 0 documents and avoids negative inventory.",
    moduleSlug: "crud-operations",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "When should you embed documents vs reference them in MongoDB schema design?",
    answer:
      "The fundamental rule of MongoDB data modeling is: **data that is accessed together should be stored together**.\n\n• Embed (Denormalize): When there is a 1-to-few relationship (e.g. user with 2-3 addresses), embedded data rarely changes independently, and child data has no lifecycle outside the parent. Delivers atomic single-read performance.\n• Reference (Normalize): When there is a 1-to-many or many-to-many relationship (e.g. authors to books, sensor logs), embedded sub-documents would grow unbounded past the 16MB document limit, or data is shared and queried across multiple entities.",
    example: `// Good Embedding: 1-to-few, read together
{
  "_id": 101,
  "title": "Clean Code",
  "publisher": { "name": "Prentice Hall", "country": "USA" },
  "tags": ["programming", "architecture"]
}

// Good Referencing: 1-to-thousands, prevents document size explosion
{
  "_id": 201,
  "authorId": 101, // Reference to author document
  "message": "Great book!",
  "postedAt": ISODate("2026-02-10T12:00:00Z")
}`,
    explanation:
      "Embedding addresses or publisher details avoids costly `$lookup` joins. Storing infinite comments as separate documents referencing `authorId` prevents exceeding the 16MB document boundary.",
    moduleSlug: "schema-design",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "How do Replica Sets provide high availability and automatic failover in MongoDB?",
    answer:
      "A MongoDB **Replica Set** is a cluster of `mongod` nodes that maintain the exact same dataset. It typically consists of one **Primary** node and multiple **Secondary** nodes.\n\n• The Primary receives all write operations and records changes to its replication log (`oplog`).\n• Secondaries continuously tail and apply the primary's `oplog`.\n• If the Primary goes down or loses network heartbeat for more than 10 seconds, the remaining secondaries conduct an automated election to vote in a new Primary without application downtime.",
    example: `// MongoDB Connection string with Replica Set discovery
mongodb://user:pass@node1.db.internal:27017,node2.db.internal:27017,node3.db.internal:27017/app_prod?replicaSet=rs0&readPreference=secondaryPreferred&w=majority`,
    explanation:
      "Specifying `w=majority` ensures write operations only return success after a majority of replica nodes confirm persisting the change to disk, preventing data loss during failovers.",
    moduleSlug: "replication-replica-sets",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "What is Sharding in MongoDB and how do Chunk Splitting and Shard Keys work?",
    answer:
      "Sharding is MongoDB's method for horizontal scaling across multiple servers to handle datasets larger than single-machine storage or throughput capacities.\n\nArchitecture components:\n• `mongos`: Query router that directs client operations to appropriate shards.\n• Config Servers: Store cluster metadata and routing mappings.\n• Shards: Individual replica sets that store chunks of the dataset.\n\nA **Shard Key** determines data partitioning. A poorly chosen shard key (such as monotonically increasing IDs) creates 'hotspotting', where all writes hit a single shard.",
    example: `// Enable sharding on database
sh.enableSharding("enterpriseApp");

// Shard collection using a hashed shard key to evenly distribute writes
sh.shardCollection("enterpriseApp.events", { customerId: "hashed" });`,
    explanation:
      "A hashed shard key computes an MD5 hash of `customerId`, guaranteeing that write traffic is evenly distributed across all shards even if customer IDs are created sequentially.",
    moduleSlug: "sharding",
    category: "mongodb",
    language: "javascript",
  },
  {
    question: "How do Multi-Document ACID Transactions work in MongoDB?",
    answer:
      "Starting in MongoDB 4.0, MongoDB supports multi-document ACID transactions across replica sets (and sharded clusters in 4.2).\n\nTransactions use a two-phase commit protocol and snapshot isolation. If any operation within the session errors, `abortTransaction()` rolls back all writes across all affected collections and documents.",
    example: `const session = client.startSession();
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { level: "majority" }
});

try {
  // Transfer funds between two users
  await accounts.updateOne({ _id: fromId }, { $inc: { balance: -200 } }, { session });
  await accounts.updateOne({ _id: toId }, { $inc: { balance: 200 } }, { session });
  
  await session.commitTransaction();
} catch (err) {
  await session.abortTransaction();
  throw err;
} finally {
  await session.endSession();
}`,
    explanation:
      "Passing `{ session }` binds both update commands to the same atomic transaction. If either update fails, none of the changes persist.",
    moduleSlug: "transactions-in-mongodb",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "How does the $lookup stage perform joins between collections in MongoDB?",
    answer:
      "The `$lookup` aggregation stage performs an equality join between two collections, appending matching documents from the foreign collection into an array field of the input document.\n\nIt is MongoDB's equivalent to an SQL `LEFT OUTER JOIN`.",
    example: `db.orders.aggregate([
  {
    $lookup: {
      from: "customers",         // Foreign collection
      localField: "customerId",  // Field in orders
      foreignField: "_id",       // Field in customers
      as: "customerDetails"      // Output array field name
    }
  },
  // Flatten single-element array to object
  {
    $unwind: {
      path: "$customerDetails",
      preserveNullAndEmptyArrays: true
    }
  }
]);`,
    explanation:
      "`$lookup` matches `orders.customerId` against `customers._id`. Using `$unwind` transforms the resulting one-element array into a flat sub-object on each order document.",
    moduleSlug: "embedded-vs-referenced-data",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "What are Mongoose Schemas, Virtuals, and Middleware in Node.js applications?",
    answer:
      "Mongoose is an Object Data Modeling (ODM) library for MongoDB and Node.js that provides schema validation, type casting, query building, and business logic hooks.\n\n• Schema: Defines shape, default values, and validations.\n• Virtuals: Computed document properties that are not stored in MongoDB.\n• Middleware (Hooks): Pre/post functions executed during document lifecycle events (like `save`, `validate`, `remove`).",
    example: `import mongoose from "mongoose";
import bcrypt from "bcrypt";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true, minlength: 8 }
});

// Pre-save middleware to hash passwords automatically
UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 12);
  }
});

export const User = mongoose.model("User", UserSchema);`,
    explanation:
      "The `pre('save')` hook ensures password hashing happens automatically right before MongoDB storage, keeping security logic centralized within the model definition.",
    moduleSlug: "mongoose-basics",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "How do you optimize slow queries in MongoDB using explain('executionStats')?",
    answer:
      "Calling `.explain('executionStats')` on a query returns internal execution engine metrics.\n\nKey metrics to evaluate:\n• `totalDocsExamined` vs `nReturned`: If `totalDocsExamined` is much higher than `nReturned`, the query is performing unindexed scans.\n• `stage`: `COLLSCAN` means a full collection scan (bad); `IXSCAN` indicates an index scan (good).\n• `executionTimeMillis`: Actual runtime taken to satisfy the query.",
    example: `db.users.find({ "location.city": "Austin", status: "ACTIVE" })
  .sort({ createdAt: -1 })
  .explain("executionStats");

// Look for:
// executionStats: {
//   nReturned: 15,
//   totalDocsExamined: 15,    // Perfect 1:1 ratio!
//   totalKeysExamined: 15,
//   executionTimeMillis: 2
// }`,
    explanation:
      "When `totalDocsExamined` matches `nReturned` exactly, every document retrieved from disk met the search criteria, proving the index cleanly isolated the result set.",
    moduleSlug: "query-optimization",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "What are MongoDB Change Streams and how do they enable real-time reactive architectures?",
    answer:
      "Change Streams allow applications to access real-time data changes across a collection, database, or entire deployment without polling. They leverage the MongoDB replica set `oplog` and stream notifications with low latency.\n\nApplications can filter change events by operation type (`insert`, `update`, `replace`, `delete`).",
    example: `const collection = db.collection("orders");
const changeStream = collection.watch([
  { $match: { "operationType": "insert", "fullDocument.total": { $gte: 500 } } }
]);

changeStream.on("change", (next) => {
  console.log("High-value order placed!", next.fullDocument);
  // Trigger real-time notifications or inventory alerts
});`,
    explanation:
      "Change streams provide resume tokens. If a microservice disconnects temporarily, it can reconnect using its last resume token without missing intermediate events.",
    moduleSlug: "change-streams",
    category: "mongodb",
    language: "javascript",
  },
  {
    question: "What are common design patterns in MongoDB schema architecture?",
    answer:
      "Specialized schema patterns address specific performance and scaling needs in MongoDB:\n\n• Subset Pattern: Embeds the top 5-10 most frequent items (e.g. recent reviews) in the main document to satisfy 90% of views, while storing the full history in a secondary collection.\n• Bucket Pattern: Groups time-series or sensor data into aggregated document chunks rather than creating one document per millisecond reading.\n• Computed Pattern: Pre-computes rollups (e.g., total sales, average rating) on write, avoiding expensive runtime aggregation on read.",
    example: `// Subset Pattern: Main movie document holds top 3 recent reviews
{
  "_id": ObjectId("..."),
  "title": "Inception",
  "director": "Christopher Nolan",
  "recentReviews": [
    { "user": "Mark", "rating": 5, "comment": "Brilliant movie!" },
    { "user": "Sarah", "rating": 4, "comment": "Mind bending." }
  ],
  "totalReviewsCount": 15420
}`,
    explanation:
      "The Subset pattern drastically reduces network transfer size by serving the first page of reviews immediately from the parent document without extra queries.",
    moduleSlug: "data-modeling-patterns",
    category: "mongodb",
    language: "javascript",
  },
  {
    question:
      "What features does MongoDB Atlas provide for managed cloud deployments?",
    answer:
      "MongoDB Atlas is a fully managed multi-cloud database service (available on AWS, Azure, and GCP).\n\nKey features include:\n• Automated provisioning, patching, and scaling of replica sets and sharded clusters.\n• Built-in Atlas Search powered by Apache Lucene for fuzzy search, autocomplete, and faceted filtering.\n• Vector Search for AI embeddings and semantic search.\n• Zero-downtime automated backups with point-in-time recovery and continuous monitoring.",
    example: `// Atlas Vector Search definition
{
  "mappings": {
    "dynamic": true,
    "fields": {
      "embedding": {
        "dimensions": 1536,
        "similarity": "cosine",
        "type": "knnVector"
      }
    }
  }
}`,
    explanation:
      "Atlas Vector Search lets you store generative AI embeddings directly inside MongoDB documents and run KNN vector similarity queries alongside standard metadata filters.",
    moduleSlug: "atlas-cloud-basics",
    category: "mongodb",
    language: "json",
  },
  {
    question:
      "How do backup and restore work in MongoDB using mongodump and mongorestore?",
    answer:
      "`mongodump` exports BSON representations of collection data and metadata files. `mongorestore` parses those BSON dumps and restores them into a target MongoDB instance.\n\nFor production clusters with continuous writes, passing `--oplog` captures changes that occurred during the dump to create a point-in-time consistent backup.",
    example: `# Backup production database with point-in-time oplog
mongodump --uri="mongodb://prod-cluster.internal:27017" --db="app_prod" --oplog --archive="backup_2026.gz" --gzip

# Restore backup to staging cluster
mongorestore --uri="mongodb://staging-cluster.internal:27017" --nsInclude="app_prod.*" --archive="backup_2026.gz" --gzip --oplogReplay`,
    explanation:
      "Using `--gzip` and `--archive` streams the entire database into a single compressed file, avoiding writing thousands of separate file descriptors to disk.",
    moduleSlug: "backup-restore",
    category: "mongodb",
    language: "bash",
  },

  // ==========================================
  // REDIS (15 Modules)
  // ==========================================
  {
    question:
      "What core data structures does Redis support beyond simple string keys?",
    answer:
      "Redis is an in-memory remote dictionary that supports rich native data structures:\n\n• Strings: Text or binary data up to 512MB (can be used as integers for atomic INCR/DECR).\n• Lists: Linked lists sorted by insertion order (`LPUSH`, `RPOP` for queues).\n• Sets: Unordered collections of unique strings (`SADD`, `SINTER` for intersections).\n• Sorted Sets (ZSet): Unique members ordered by a floating-point score (`ZADD`, `ZRANGEBYSCORE` for leaderboards).\n• Hashes: Maps between string fields and string values (`HSET`, `HGETALL` for objects).\n• Bitmaps & HyperLogLogs: Space-efficient structures for bit manipulation and cardinal counting.",
    example: `# Leaderboard using Sorted Sets (ZSet)
ZADD game_leaderboard 4500 "PlayerAlpha"
ZADD game_leaderboard 6200 "PlayerBeta"
ZADD game_leaderboard 3100 "PlayerGamma"

# Get top 2 players descending with their scores
ZREVRANGE game_leaderboard 0 1 WITHSCORES
# Output:
# 1) "PlayerBeta"
# 2) "6200"
# 3) "PlayerAlpha"
# 4) "4500"`,
    explanation:
      "Because elements in a Sorted Set are kept ordered in a skip-list with O(log N) insertion and retrieval, leaderboards update in real-time even with millions of active players.",
    moduleSlug: "data-structures",
    category: "redis",
    language: "bash",
  },
  {
    question:
      "What are the common caching patterns with Redis (Cache-Aside, Write-Through, Write-Behind)?",
    answer:
      "1. Cache-Aside (Lazy Loading): The application first checks Redis. On cache hit, it returns the data. On cache miss, it reads from the primary database, writes the result to Redis with a TTL, and returns. Most popular pattern.\n2. Write-Through: The application writes to the cache and the primary database synchronously. Guarantees cache consistency at the cost of higher write latency.\n3. Write-Behind (Write-Back): The application writes directly to Redis, and an asynchronous worker process batches and writes updates to the database in the background. High write throughput, but risks data loss on sudden crashes.",
    example: `async function getUserProfile(userId) {
  const cacheKey = \`user:\${userId}\`;
  
  // 1. Check Redis cache
  const cached = await redis.get(cacheKey);
  if (cached) return JSON.parse(cached);
  
  // 2. Fallback to SQL Database on cache miss
  const user = await db.users.findById(userId);
  
  // 3. Populate cache with 1-hour TTL
  if (user) {
    await redis.set(cacheKey, JSON.stringify(user), "EX", 3600);
  }
  return user;
}`,
    explanation:
      "Cache-Aside ensures that only frequently accessed users occupy RAM. The 3600-second TTL prevents stale data from persisting indefinitely if updates happen outside the app.",
    moduleSlug: "caching-strategies",
    category: "redis",
    language: "javascript",
  },
  {
    question:
      "How do Redis Pub/Sub and Redis Streams differ for messaging architectures?",
    answer:
      "• Pub/Sub (`PUBLISH`, `SUBSCRIBE`): A fire-and-forget message broker. If a subscriber is offline or disconnected when a message is published, the message is permanently lost. Messages are not persisted to memory or disk.\n• Redis Streams (`XADD`, `XREADGROUP`): An append-only log structure modeled after Apache Kafka. Messages are persisted, support consumer groups, acknowledge delivery (`XACK`), and allow consumers to resume reading from any point in the history after a restart.",
    example: `# Redis Streams Example: Producer adds event
XADD orders_stream * customer_id 902 total 129.99

# Consumer Group reads next unread message
XREADGROUP GROUP billing_workers worker_1 COUNT 1 STREAMS orders_stream >

# Acknowledge completion of task
XACK orders_stream billing_workers "1695000000000-0"`,
    explanation:
      "Redis Streams provide guaranteed delivery and parallel load-balancing among worker instances, unlike traditional ephemeral Pub/Sub.",
    moduleSlug: "pubsub-streams",
    category: "redis",
    language: "bash",
  },
  {
    question: "How do RDB and AOF persistence mechanisms work in Redis?",
    answer:
      "Redis offers two persistence options to protect in-memory data against power outages:\n\n• RDB (Redis Database Snapshot): Creates point-in-time compact snapshots of the entire dataset at specified intervals (e.g. every 5 minutes). Uses copy-on-write `fork()` to avoid blocking the main server. Very fast restart times, but risks losing changes made since the last snapshot.\n• AOF (Append-Only File): Logs every write operation received by the server to a disk journal. Can be synced to disk every second (`fsync everysec`). Minimal data loss (at most 1 second), but produces larger disk files.\n\nProduction deployments usually enable both simultaneously.",
    example: `# Redis configuration (redis.conf)
# Snapshot rules: save after 60 sec if at least 1000 keys changed
save 60 1000

# Enable Append Only File
appendonly yes
appendfsync everysec # High performance with max 1 sec potential data loss
auto-aof-rewrite-percentage 100
auto-aof-rewrite-min-size 64mb`,
    explanation:
      "`appendfsync everysec` provides a great balance: performance is nearly as fast as pure RAM, while worst-case disaster recovery loses at most one second of transactions.",
    moduleSlug: "persistence-rdbaof",
    category: "redis",
    language: "ini",
  },
  {
    question:
      "How does key expiration (TTL) work in Redis and what are the eviction policies?",
    answer:
      "Keys can have a Time-To-Live (`EXPIRE`, `SETEX`). Redis removes expired keys via two mechanisms:\n1. Passive Eviction: When a client attempts to access an expired key, Redis detects it and deletes it before responding with `nil`.\n2. Active Eviction: Background routine periodically samples random keys and deletes expired entries.\n\nWhen memory hits `maxmemory`, eviction policies take effect:\n• `allkeys-lru` / `volatile-lru`: Evicts least-recently-used keys.\n• `allkeys-lfu`: Evicts least-frequently-used keys.\n• `noeviction`: Returns errors on writes when memory is full.",
    example: `# Set a verification code with a 5-minute TTL
SET verify:user_88 "492019" EX 300

# Check remaining time to live in seconds
TTL verify:user_88
# Output: (integer) 284`,
    explanation:
      "After 300 seconds, the key automatically expires. Using Redis for ephemeral tokens avoids accumulating temporary records in your primary relational database.",
    moduleSlug: "expiration-ttl",
    category: "redis",
    language: "bash",
  },
  {
    question:
      "Why is Redis ideal as a centralized Session Store for distributed web applications?",
    answer:
      "In a stateless multi-server web architecture, requests from the same user may hit different backend application servers. Storing sessions in single-server memory requires sticky sessions, which impedes load balancing.\n\nRedis provides sub-millisecond centralized session lookups, supports TTL expiration for idle sessions, and scales horizontally.",
    example: `import session from "express-session";
import { RedisStore } from "connect-redis";
import { createClient } from "redis";

const redisClient = createClient({ url: "redis://127.0.0.1:6379" });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient, prefix: "sess:" }),
  secret: "session_secret_key",
  resave: false,
  saveUninitialized: false,
  cookie: { secure: true, maxAge: 86400000 } // 24 hours
}));`,
    explanation:
      "Every app instance reads and writes user sessions to Redis via `sess:<id>`. When a user logs out, calling `session.destroy()` purges the Redis key immediately across all servers.",
    moduleSlug: "redis-as-a-session-store",
    category: "redis",
    language: "javascript",
  },
  {
    question:
      "What are practical real-world use cases for Redis Sorted Sets (ZSets)?",
    answer:
      "Because Sorted Sets maintain unique elements ordered by a numerical score in O(log N) time, they excel at:\n1. Real-time gaming leaderboards.\n2. Sliding-window rate limiters.\n3. Priority queues (jobs with priority scores).\n4. Geolocation indexing (GeoHash scores).\n5. Scheduled delayed tasks (scoring by future UNIX timestamp).",
    example: `# Delayed Task Queue: Add tasks with execution UNIX timestamp as score
ZADD delayed_queue 1774300000 "task:send_reminder_email:user_45"

# Background worker fetches tasks ready to run (score <= current_time)
ZRANGEBYSCORE delayed_queue 0 1774300050 LIMIT 0 10`,
    explanation:
      "Workers query `ZRANGEBYSCORE` with the current timestamp. If a task's scheduled timestamp has arrived, it is retrieved and processed immediately.",
    moduleSlug: "sorted-sets-use-cases",
    category: "redis",
    language: "bash",
  },
  {
    question: "How do transactions work in Redis using MULTI, EXEC, and WATCH?",
    answer:
      "Redis transactions are sequential and isolated. All commands inside a `MULTI` block are queued and executed atomically in a single batch upon `EXEC`.\n\n`WATCH` provides Optimistic Concurrency Control (Check-and-Set). If any watched key is modified by another client before `EXEC` runs, the transaction aborts and returns a nil multi-bulk response.",
    example: `# Optimistic locking balance transfer
WATCH account:101
val = GET account:101

# Begin atomic transaction block
MULTI
DECRBY account:101 50
INCRBY account:202 50
EXEC
# If another client modified account:101 after WATCH, EXEC returns nil and cancels!`,
    explanation:
      "`WATCH` avoids pessimistic locking overhead. If a collision occurs, the application simply re-reads the value and retries.",
    moduleSlug: "transactions-multiexec",
    category: "redis",
    language: "bash",
  },
  {
    question: "How does Master-Replica replication work in Redis?",
    answer:
      "Redis replication is asynchronous. A primary master node continuously sends a stream of write commands to connected replicas.\n\n• Replication buffer: Master maintains a backlog buffer to catch up briefly disconnected replicas via partial resynchronization (PSYNC).\n• Read scaling: Replicas accept read queries, offloading read volume from the master.\n• High availability: Paired with **Redis Sentinel** to automatically detect master failures and elect a replica as the new master.",
    example: `# Configure replica node to follow master
REPLICAOF master.redis.internal 6379

# Confirm replication state
INFO replication
# Output:
# role:slave
# master_host:master.redis.internal
# master_link_status:up`,
    explanation:
      "Replicas provide read scalability and redundancy. In the event of primary hardware failure, Sentinel promotes a replica to primary without manual intervention.",
    moduleSlug: "replication",
    category: "redis",
    language: "bash",
  },
  {
    question:
      "What is Redis Cluster and how do Hash Slots distribute keys across nodes?",
    answer:
      "Redis Cluster provides automatic sharding across multiple Redis nodes without relying on external proxies.\n\n• Key Space: Fixed into **16,384 Hash Slots**.\n• Routing: The CRC16 checksum of a key modulo 16384 determines its slot: `CRC16(key) % 16384`.\n• Hash Tags: Wrapping part of a key in `{}` (e.g., `user:{101}:profile`) ensures related keys hash to the exact same slot, enabling multi-key operations.",
    example: `# Without Hash Tag: May land on different nodes (fails multi-key MGET)
# user:101:profile -> Slot 4520
# user:101:orders  -> Slot 12901

# With Hash Tag: Both hash on "101" -> guaranteed same slot!
MGET {user:101}:profile {user:101}:orders`,
    explanation:
      "Hash tags allow complex multi-key transactions and pipelines within a distributed Redis Cluster by guaranteeing co-location on the same physical shard.",
    moduleSlug: "redis-cluster",
    category: "redis",
    language: "bash",
  },
  {
    question: "Why should you use Lua Scripting in Redis using EVAL?",
    answer:
      "Redis executes Lua scripts atomically on the server. While a Lua script runs, no other script or Redis command can execute, eliminating race conditions between read and write steps without `WATCH` loops.\n\nIt reduces network latency by compressing multiple round trips into a single server-side execution.",
    example: `-- Atomic Rate Limiter in Lua (Keys: [rate_key], Args: [limit, window_seconds])
local current = redis.call('INCR', KEYS[1])
if tonumber(current) == 1 then
    redis.call('EXPIRE', KEYS[1], ARGV[2])
end
if tonumber(current) > tonumber(ARGV[1]) then
    return 0 -- Rejected (rate limit exceeded)
else
    return 1 -- Allowed
end`,
    explanation:
      "Because this entire check-and-increment script runs atomically on the Redis thread, two simultaneous requests can never bypass the rate limiter.",
    moduleSlug: "lua-scripting",
    category: "redis",
    language: "lua",
  },
  {
    question:
      "How do you implement a Sliding Window Rate Limiter using Redis Sorted Sets?",
    answer:
      "A sliding window rate limiter prevents the 'burst at the boundary' flaw of fixed-window counters. It tracks individual request timestamps in a Sorted Set per user.\n\nAlgorithm steps:\n1. Remove entries older than `now - window_size` (`ZREMRANGEBYSCORE`).\n2. Count remaining elements in the set (`ZCARD`).\n3. If count < limit, add the current timestamp (`ZADD`) and allow the request.",
    example: `async function isRateLimited(userId, limit = 10, windowSec = 60) {
  const key = \`rate:\${userId}\`;
  const now = Date.now();
  const clearBefore = now - (windowSec * 1000);
  
  const multi = redis.multi();
  multi.zremrangebyscore(key, 0, clearBefore);
  multi.zcard(key);
  multi.zadd(key, now, \`\${now}:\${Math.random()}\`);
  multi.expire(key, windowSec);
  
  const results = await multi.exec();
  const currentCount = results[1][1];
  
  return currentCount >= limit; // true = blocked, false = permitted
}`,
    explanation:
      "By recording distinct timestamps as score and member, the sliding window is accurate down to the millisecond, completely preventing edge bursts.",
    moduleSlug: "rate-limiting-with-redis",
    category: "redis",
    language: "javascript",
  },
  {
    question:
      "What is Redis Pipelining and how does it dramatically improve throughput?",
    answer:
      "Under regular client communication, Redis uses a synchronous request/response model: the client sends a command, pauses for network transit, and waits for the server response before sending the next command.\n\n**Pipelining** allows the client to send dozens or hundreds of commands without waiting for intermediate responses. The server executes them in sequence and bundles all replies in a single network packet.",
    example: `// Benchmark: Sending 10,000 keys with Pipelining vs Sequentially
const pipeline = redis.pipeline();

for (let i = 0; i < 10000; i++) {
  pipeline.set(\`item:\${i}\`, \`value_\${i}\`);
}

// All 10,000 commands sent in 1-2 TCP roundtrips!
const results = await pipeline.exec();
console.log("Successfully wrote 10k keys in a few milliseconds!");`,
    explanation:
      "Pipelining minimizes round-trip time (RTT). A operation that would take 10 seconds across 10,000 round-trips can complete in under 50 milliseconds using a pipeline.",
    moduleSlug: "pipelining",
    category: "redis",
    language: "javascript",
  },
  {
    question:
      "What are common architectural patterns for Pub/Sub in distributed systems?",
    answer:
      "Common Redis Pub/Sub patterns include:\n• Event Broadcasting: Notifying thousands of connected WebSocket servers to broadcast an update to end-user clients.\n• Cache Invalidation: Publishing an eviction notice whenever an entity updates in the database so all microservices invalidate their local in-memory caches.\n• Configuration Reload: Notifying worker pods to refresh feature flags dynamically.",
    example: `// Cache Invalidation Publisher
async function updateProductPrice(productId, newPrice) {
  await db.products.update(productId, { price: newPrice });
  // Publish invalidation event across the cluster
  await redis.publish("cache:invalidate", JSON.stringify({ entity: "product", id: productId }));
}

// Subscriber on all app nodes
redisSubscriber.subscribe("cache:invalidate", (message) => {
  const { entity, id } = JSON.parse(message);
  localMemoryCache.del(\`\${entity}:\${id}\`);
});`,
    explanation:
      "Broadcasting cache invalidation through Redis Pub/Sub ensures that multi-server local memory caches stay synchronized with the primary database.",
    moduleSlug: "pubsub-patterns",
    category: "redis",
    language: "javascript",
  },
  {
    question:
      "How do you optimize memory consumption in Redis production deployments?",
    answer:
      "Techniques for optimizing Redis memory footprint:\n1. Choose compact encodings: Use small Hashes instead of plain string keys where possible (Redis uses memory-efficient `ziplist` / `listpack`).\n2. Set explicit `maxmemory` and appropriate eviction policies (`volatile-lru`).\n3. Set TTLs on all temporary or cache keys.\n4. Shorten key names (e.g. `u:101:s` instead of `user_session_tracker:101:session_data`).\n5. Disable or tune active defragmentation (`activedefrag yes`).",
    example: `# Check memory fragmentation and memory usage metrics
INFO memory
# Key indicators:
# used_memory_human: 1.45G
# used_memory_peak_human: 2.10G
# mem_fragmentation_ratio: 1.12 (Ideal is between 1.0 and 1.5)

# Inspect memory consumption of an individual key
MEMORY USAGE user:101:profile`,
    explanation:
      "A fragmentation ratio significantly above 1.5 indicates memory wasted by the OS allocator. Enabling `activedefrag yes` cleans up fragmented allocation gaps online.",
    moduleSlug: "memory-optimization",
    category: "redis",
    language: "bash",
  },

  // ==========================================
  // SQLITE (15 Modules)
  // ==========================================
  {
    question: "What is SQLite and how does its serverless architecture work?",
    answer:
      "SQLite is a self-contained, serverless, zero-configuration, transactional SQL database engine. Unlike client-server databases like PostgreSQL or MySQL that run as independent background daemons listening on network ports, SQLite is an embedded library linked directly into the host application.\n\nThe entire database (tables, indexes, schema, and data) is stored in a single cross-platform disk file.",
    example: `-- SQLite standard query syntax
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    is_done INTEGER DEFAULT 0 CHECK(is_done IN (0, 1)),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO tasks (title) VALUES ('Prepare product launch');
SELECT * FROM tasks WHERE is_done = 0;`,
    explanation:
      "Because SQLite runs within the application's process memory, there is zero network overhead, making small reads and writes extraordinarily fast.",
    moduleSlug: "basic-queries",
    category: "sqlite",
    language: "sql",
  },
  {
    question:
      "How do transactions work in SQLite and what is the difference between DEFERRED, IMMEDIATE, and EXCLUSIVE?",
    answer:
      "SQLite transactions ensure ACID compliance through locking states on the database file:\n\n• `BEGIN DEFERRED` (default): No lock is acquired when the transaction begins. Locks are acquired on the first read (`SHARED`) or write (`RESERVED`). Can cause `SQLITE_BUSY` if another writer intervened.\n• `BEGIN IMMEDIATE`: Acquires a `RESERVED` lock immediately. Other connections can read, but no other connection can begin a write transaction.\n• `BEGIN EXCLUSIVE`: Acquires an `EXCLUSIVE` lock immediately, blocking all other connections from both reading and writing.",
    example: `-- Immediate transaction prevents write lock race conditions
BEGIN IMMEDIATE TRANSACTION;

UPDATE inventory 
SET quantity = quantity - 1 
WHERE item_id = 505 AND quantity > 0;

COMMIT;`,
    explanation:
      "Using `BEGIN IMMEDIATE` guarantees that the writer reserves write access right away, preventing unexpected database busy errors mid-transaction.",
    moduleSlug: "transactions",
    category: "sqlite",
    language: "sql",
  },
  {
    question:
      "What is SQLite's Type Affinity system and how does it differ from strict static SQL typing?",
    answer:
      "SQLite uses dynamic typing with 'Type Affinity' rather than rigid static types. The datatype of a value is associated with the value itself, not with its column container.\n\nSQLite recognizes 5 storage classes:\n1. `NULL`\n2. `INTEGER`\n3. `REAL` (floating point)\n4. `TEXT`\n5. `BLOB` (binary data)\n\nColumns have affinities (`TEXT`, `NUMERIC`, `INTEGER`, `REAL`, `BLOB`) that determine how incoming values are converted. In SQLite 3.37+, you can also opt into strict mode via `CREATE TABLE ... STRICT`.",
    example: `-- Strict mode table (SQLite 3.37+)
CREATE TABLE strict_users (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL,
    age INT,
    registered_at TEXT
) STRICT;

-- In STRICT tables, inserting a string into 'age' will throw an error:
-- INSERT INTO strict_users VALUES (1, 'Alice', 'twenty', '2026-01-01'); -- Fails!`,
    explanation:
      "Traditional SQLite allows any datatype in any column (except `INTEGER PRIMARY KEY`). The `STRICT` table option brings standard relational type enforcement when desired.",
    moduleSlug: "data-types-in-sqlite",
    category: "sqlite",
    language: "sql",
  },
  {
    question:
      "How do B-Tree indexes work in SQLite and what is a Covering Index?",
    answer:
      "SQLite uses B-Tree indexes to accelerate lookups. When an index contains all the columns needed by a query (a Covering Index), SQLite satisfies the query entirely from the index B-Tree without seeking the main table data pages.",
    example: `-- Create covering index
CREATE INDEX idx_orders_customer_date_total 
ON orders (customer_id, order_date, total);

-- Query covered completely by index (zero table page reads)
SELECT order_date, total 
FROM orders 
WHERE customer_id = 99;`,
    explanation:
      "Because `customer_id`, `order_date`, and `total` all reside inside `idx_orders_customer_date_total`, SQLite avoids the secondary lookup into the `orders` row storage.",
    moduleSlug: "indexes",
    category: "sqlite",
    language: "sql",
  },
  {
    question:
      "How do Foreign Key constraints work in SQLite and why must they be enabled explicitly?",
    answer:
      "For backwards compatibility with legacy SQLite 2 databases, SQLite has foreign key constraint enforcement **disabled by default**. To enforce foreign key checks and cascade rules, applications must execute `PRAGMA foreign_keys = ON;` upon opening every database connection.",
    example: `-- Must run on EVERY new connection!
PRAGMA foreign_keys = ON;

CREATE TABLE authors (
    id INTEGER PRIMARY KEY,
    name TEXT NOT NULL
);

CREATE TABLE articles (
    id INTEGER PRIMARY KEY,
    author_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    FOREIGN KEY (author_id) REFERENCES authors(id) ON DELETE CASCADE
);`,
    explanation:
      "Without executing `PRAGMA foreign_keys = ON;`, SQLite silently permits inserting non-existent `author_id` values and ignores `ON DELETE CASCADE` rules.",
    moduleSlug: "foreign-keys",
    category: "sqlite",
    language: "sql",
  },
  {
    question:
      "When should you choose SQLite over client-server databases like PostgreSQL or MySQL?",
    answer:
      "Choose SQLite for:\n• Embedded software, mobile apps (iOS / Android), desktop apps (Electron), and IoT devices.\n• Local development, unit testing, and edge computing (Cloudflare D1, Fly.io LiteFS).\n• Medium-traffic web apps where writes are moderate and reads dominate.\n\nChoose PostgreSQL/MySQL for:\n• High concurrent write throughput distributed across multiple servers.\n• Complex access control, enterprise replication, or datasets exceeding multiple terabytes.",
    example: `-- Pragmas to optimize SQLite for web application workloads
PRAGMA journal_mode = WAL;
PRAGMA synchronous = NORMAL;
PRAGMA cache_size = -64000; -- 64MB RAM cache
PRAGMA busy_timeout = 5000; -- Wait 5s on lock before throwing SQLITE_BUSY`,
    explanation:
      "With these pragmas configured, SQLite easily sustains thousands of reads and hundreds of writes per second on modern NVMe drives.",
    moduleSlug: "sqlite-vs-other-dbs",
    category: "sqlite",
    language: "sql",
  },
  {
    question: "How do in-memory databases work in SQLite?",
    answer:
      "SQLite allows creating transient databases residing entirely in RAM by specifying `:memory:` as the database filename (or using memory URI filenames). In-memory databases are exceptionally fast and vanish completely when the connection closes.",
    example: `import Database from "better-sqlite3";

// Create in-memory SQLite database instance
const db = new Database(":memory:");

db.exec(\`
  CREATE TABLE benchmarks (id INTEGER PRIMARY KEY, score REAL);
  INSERT INTO benchmarks (score) VALUES (98.6), (99.2);
\`);

const rows = db.prepare("SELECT AVG(score) AS avgScore FROM benchmarks").get();
console.log("Memory DB Average:", rows.avgScore);`,
    explanation:
      "In-memory databases provide ideal test fixtures for CI/CD test suites: each test run gets an isolated, ephemeral database without disk I/O cleanup.",
    moduleSlug: "in-memory-databases",
    category: "sqlite",
    language: "javascript",
  },
  {
    question: "How do you backup and export an active SQLite database safely?",
    answer:
      "Simply copying an active SQLite file while writers are active can lead to corrupted backup files. SQLite provides the **Online Backup API** (and the `.backup` CLI command) to generate consistent snapshot copies while concurrent reads and writes continue uninterrupted.",
    example: `# Safe command-line backup of a live SQLite database
sqlite3 production.db ".backup 'backup_copy.db'"

# Export complete database schema and data as plain SQL text
sqlite3 production.db .dump > full_dump.sql`,
    explanation:
      "The `.backup` command coordinates with SQLite's internal lock pager, ensuring that active WAL writes do not result in torn or half-written pages.",
    moduleSlug: "backup-export",
    category: "sqlite",
    language: "bash",
  },
  {
    question:
      "What is WAL (Write-Ahead Logging) mode in SQLite and why is it superior to rollback journals?",
    answer:
      "By default, SQLite uses a rollback journal: writes lock out readers entirely while writing back changes.\n\nIn **WAL mode** (`PRAGMA journal_mode = WAL;`), changes are appended to a separate `-wal` file. This provides **true concurrency**: readers never block writers, and writers never block readers.",
    example: `-- Enable WAL mode (persists across restarts)
PRAGMA journal_mode = WAL;

-- Set synchronous mode to NORMAL for maximum WAL speed with durability
PRAGMA synchronous = NORMAL;`,
    explanation:
      "In WAL mode, multiple processes can read from the base database file while a writer appends to the `-wal` file simultaneously.",
    moduleSlug: "wal-mode",
    category: "sqlite",
    language: "sql",
  },
  {
    question: "How does Full-Text Search (FTS5) work in SQLite?",
    answer:
      "SQLite includes the **FTS5** virtual table module, implementing an inverted index for fast full-text searching, tokenization, BM25 relevance ranking, and highlighted snippets.",
    example: `-- Create FTS5 virtual table
CREATE VIRTUAL TABLE documents_fts USING fts5(title, body);

-- Insert content
INSERT INTO documents_fts (title, body) 
VALUES ('SQLite Performance', 'WAL mode and index coverage improve database speed dramatically.');

-- Search with BM25 ranking and highlighted snippet
SELECT 
    title,
    snippet(documents_fts, 1, '<b>', '</b>', '...', 15) AS preview,
    bm25(documents_fts) AS rank
FROM documents_fts
WHERE documents_fts MATCH 'speed OR performance'
ORDER BY rank;`,
    explanation:
      "FTS5 indexes token stems and matches complex boolean queries with sub-millisecond execution times without external full-text search software.",
    moduleSlug: "full-text-search-fts",
    category: "sqlite",
    language: "sql",
  },
  {
    question: "How do Triggers work in SQLite?",
    answer:
      "SQLite triggers execute automated SQL actions `BEFORE` or `AFTER` an `INSERT`, `UPDATE`, or `DELETE` on a specified table. Special `NEW` and `OLD` record pseudotables provide access to changing row states.",
    example: `CREATE TABLE product_history (
    product_id INTEGER,
    old_price REAL,
    new_price REAL,
    updated_at TEXT
);

CREATE TRIGGER audit_price_updates
AFTER UPDATE OF price ON products
FOR EACH ROW
WHEN OLD.price != NEW.price
BEGIN
    INSERT INTO product_history (product_id, old_price, new_price, updated_at)
    VALUES (OLD.id, OLD.price, NEW.price, datetime('now'));
END;`,
    explanation:
      "Whenever a product's price changes, this trigger automatically records the old and new prices into the audit log table.",
    moduleSlug: "triggers",
    category: "sqlite",
    language: "sql",
  },
  {
    question: "How do Views work in SQLite?",
    answer:
      "Views in SQLite are virtual tables defined by an underlying `SELECT` statement. They do not store data physically, simplifying access to complex queries and multi-table joins.",
    example: `CREATE VIEW active_user_summaries AS
SELECT 
    u.id,
    u.name,
    COUNT(o.id) AS order_count,
    COALESCE(SUM(o.total), 0) AS total_spent
FROM users u
LEFT JOIN orders o ON u.id = o.user_id
WHERE u.status = 'active'
GROUP BY u.id, u.name;

-- Query the view directly
SELECT * FROM active_user_summaries WHERE total_spent > 500;`,
    explanation:
      "Views encapsulate joining and aggregation logic, exposing a clean tabular abstraction to application code.",
    moduleSlug: "views",
    category: "sqlite",
    language: "sql",
  },
  {
    question: "What are the concurrency limitations of SQLite?",
    answer:
      "While SQLite supports multiple concurrent readers (especially in WAL mode), it supports **only one writer at any single instant in time**. If a second connection attempts to write while the database is locked, it must wait or fail with `SQLITE_BUSY`.\n\nSetting `PRAGMA busy_timeout = 5000;` instructs SQLite to sleep and retry for up to 5 seconds before failing.",
    example: `-- Set busy timeout to 5000 milliseconds (5 seconds)
PRAGMA busy_timeout = 5000;`,
    explanation:
      "Configuring a busy timeout prevents transient write collisions from immediately crashing application queries under concurrent write loads.",
    moduleSlug: "concurrency-limitations",
    category: "sqlite",
    language: "sql",
  },
  {
    question:
      "How do modern ORMs (Prisma, Drizzle, TypeORM) interact with SQLite?",
    answer:
      "ORMs map TypeScript/JavaScript classes or schemas directly to SQLite tables. Because SQLite does not support all `ALTER TABLE` operations (like renaming or dropping certain columns with constraints in older versions), ORMs employ shadow table migrations: creating a new table, copying existing data over, dropping the old table, and renaming the new table.",
    example: `// Example Drizzle ORM Schema with SQLite
import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  createdAt: text("created_at").default("CURRENT_TIMESTAMP"),
});`,
    explanation:
      "Drizzle translates TypeScript definitions into efficient, native SQLite queries with full end-to-end type safety.",
    moduleSlug: "using-sqlite-with-orms",
    category: "sqlite",
    language: "typescript",
  },
  {
    question: "What does VACUUM do in SQLite and why is it necessary?",
    answer:
      "When rows or tables are deleted in SQLite, the freed database pages are marked as unused on an internal 'free list' rather than returned to the operating system. Over time, frequent deletions create internal database fragmentation.\n\nThe `VACUUM` command rebuilds the entire database file into a clean, compact file, freeing unused space back to the operating system and defragmenting B-Tree pages for faster sequential access.",
    example: `-- Reclaim unused disk space and defragment database
VACUUM;

-- Alternatively, enable auto-vacuuming before initial table creation
PRAGMA auto_vacuum = FULL;`,
    explanation:
      "Running `VACUUM` reduces database file size on disk and reorganizes pages contiguously, improving subsequent read speeds.",
    moduleSlug: "vacuuming-optimization",
    category: "sqlite",
    language: "sql",
  },

  // ==========================================
  // FIREBASE (15 Modules)
  // ==========================================
  {
    question:
      "How does Google Cloud Firestore store data and what is the Collection-Document model?",
    answer:
      "Cloud Firestore is a flexible, scalable NoSQL cloud database for client and server development. Data is stored in **Documents**, which are grouped into **Collections**.\n\nDocuments contain key-value pairs and can contain nested subcollections, forming hierarchical data structures that scale horizontally with high read/write performance.",
    example: `import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

const db = getFirestore();

// Create or update a document in the "cities" collection
await setDoc(doc(db, "cities", "SF"), {
  name: "San Francisco",
  state: "CA",
  country: "USA",
  population: 870000
});

// Retrieve document
const docSnap = await getDoc(doc(db, "cities", "SF"));
if (docSnap.exists()) {
  console.log("City data:", docSnap.data());
}`,
    explanation:
      "Firestore documents are schemaless JSON-like structures that support primitive datatypes, arrays, maps, and GeoPoints.",
    moduleSlug: "firestore-basics",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does Firebase Authentication handle user management and OAuth providers?",
    answer:
      "Firebase Authentication provides complete backend services and SDKs to authenticate users via passwords, phone numbers, and popular federated identity providers (Google, GitHub, Apple, Facebook).\n\nUpon successful login, Firebase issues signed JSON Web Tokens (JWT) containing user UID and claims, which are automatically verified by Firestore and Cloud Storage Security Rules.",
    example: `import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";

const auth = getAuth();
const provider = new GoogleAuthProvider();

try {
  const result = await signInWithPopup(auth, provider);
  const user = result.user;
  console.log("Logged in user:", user.displayName, user.email, user.uid);
} catch (error) {
  console.error("Auth failed:", error.message);
}`,
    explanation:
      "Client SDKs automatically manage token refresh cycles in the background and persist user state across page reloads in IndexedDB/LocalStorage.",
    moduleSlug: "authentication",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How do Firebase Cloud Functions work and how do you write HTTPS callable functions?",
    answer:
      "Cloud Functions for Firebase allows running serverless backend code in response to HTTPS requests or Firebase events (such as Firestore document updates, Auth user creation, or Storage uploads).\n\n**Callable Functions** automatically deserialize parameters and inject authentication context (`context.auth`), ensuring secure client-to-server communication.",
    example: `import { onCall, HttpsError } from "firebase-functions/v2/https";
import { getFirestore } from "firebase-admin/firestore";

export const addAdminRole = onCall(async (request) => {
  // Enforce caller authentication and authorization
  if (!request.auth || !request.auth.token.admin) {
    throw new HttpsError("permission-denied", "Only administrators can assign roles.");
  }
  
  const { targetUid } = request.data;
  const db = getFirestore();
  await db.collection("users").doc(targetUid).update({ role: "admin" });
  
  return { success: true, message: \`User \${targetUid} promoted to admin.\` };
});`,
    explanation:
      "Callable functions handle CORS, authentication verification, and error serialization automatically.",
    moduleSlug: "cloud-functions",
    category: "firebase",
    language: "typescript",
  },
  {
    question:
      "What is the difference between Firebase Realtime Database and Cloud Firestore?",
    answer:
      "• Realtime Database: Firebase's original database. Stores data as one giant monolithic JSON tree. Offers lower latency for simple state syncing, but has limited querying capabilities (queries can only sort/filter on a single property) and does not scale past ~200,000 concurrent connections without manual sharding.\n• Cloud Firestore: The modern successor. Stores data as discrete documents in collections. Offers shallow querying, robust multi-attribute compound filtering, automatic multi-region scaling, and richer security rules.",
    example: `// Firestore allows querying sub-documents without fetching child data:
// Fetching a user document does NOT automatically download its 10,000 subcollection posts!
const userRef = doc(db, "users", "user_123");
const userSnap = await getDoc(userRef); // Lightweight, fast read!`,
    explanation:
      "Firestore's shallow queries mean document reads only fetch the specified document, keeping bandwidth and query costs low.",
    moduleSlug: "realtime-database-vs-firestore",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How do Firebase Security Rules protect Firestore data from unauthorized access?",
    answer:
      "Security Rules run on Google's servers before any read or write operation executes. They evaluate authentication state (`request.auth`), incoming data (`request.resource.data`), and existing database state (`resource.data`) to permit or deny access.",
    example: `rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can only read and write their own profile document
    match /users/{userId} {
      allow read: if request.auth != null;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Anyone can read public posts, but only authors can edit
    match /posts/{postId} {
      allow read: if true;
      allow create: if request.auth != null && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if request.auth != null && resource.data.authorId == request.auth.uid;
    }
  }
}`,
    explanation:
      "Security Rules guarantee that malicious clients interacting directly with the Firestore client SDK cannot manipulate or access other users' data.",
    moduleSlug: "security-rules",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does Firebase Hosting serve web applications and handle rewrite rules for SPAs?",
    answer:
      "Firebase Hosting provides fast, secure hosting for static assets (HTML, CSS, JS, images) and serverless web apps backed by a global CDN with free SSL certificates.\n\nFor Single Page Applications (React, Vue, Next.js), you configure rewrites in `firebase.json` to route all page requests to `index.html` so client-side routers handle navigation.",
    example: `{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**/*.@(jpg|jpeg|png|svg|webp)",
        "headers": [{ "key": "Cache-Control", "value": "max-age=31536000" }]
      }
    ]
  }
}`,
    explanation:
      "The `**` rewrite ensures deep links (e.g. `/profile/settings`) correctly load `index.html`, letting the frontend SPA router resolve the view.",
    moduleSlug: "firebase-hosting",
    category: "firebase",
    language: "json",
  },
  {
    question:
      "How does Firebase Cloud Storage work and how do you upload files with progress tracking?",
    answer:
      "Cloud Storage for Firebase stores user-generated content such as images, audio, and videos in Google Cloud Storage buckets. The SDK supports resumable uploads that automatically resume after network drops.",
    example: `import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const storage = getStorage();
const fileRef = ref(storage, \`avatars/\${userId}.jpg\`);
const uploadTask = uploadBytesResumable(fileRef, file);

uploadTask.on("state_changed", 
  (snapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log(\`Upload is \${progress.toFixed(1)}% done\`);
  }, 
  (error) => console.error("Upload error:", error), 
  async () => {
    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
    console.log("File available at:", downloadURL);
  }
);`,
    explanation:
      "`uploadBytesResumable` emits real-time progress events and recovers automatically if connectivity fluctuates during large media uploads.",
    moduleSlug: "cloud-storage",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does Firebase Cloud Messaging (FCM) deliver cross-platform push notifications?",
    answer:
      "FCM is a cross-platform messaging solution that sends notifications and data payloads reliably across Android, iOS, and the web at no cost.\n\nClients register to receive a unique registration token. Backend servers or Cloud Functions use the Firebase Admin SDK to target individual tokens or broadcast to pub/sub topics.",
    example: `import { getMessaging } from "firebase-admin/messaging";

const message = {
  notification: {
    title: "Order Shipped!",
    body: "Your package is on its way and will arrive tomorrow."
  },
  data: {
    orderId: "ord_99812",
    trackingUrl: "https://example.com/track/99812"
  },
  token: userDeviceFCMToken
};

const response = await getMessaging().send(message);
console.log("Successfully sent message:", response);`,
    explanation:
      "FCM handles wake locks, battery optimization, and operating system notification channels across devices automatically.",
    moduleSlug: "firebase-cloud-messaging-push",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does Firestore offline persistence work on web and mobile devices?",
    answer:
      "Firestore provides built-in offline data caching. When enabled, the SDK caches a local copy of documents that the application actively listens to or queries.\n\nWhen the device loses connectivity, reads return data from the local cache and writes are queued locally. Once connection is restored, the SDK automatically synchronizes offline modifications with the server.",
    example: `import { initializeFirestore, persistentLocalCache, persistentMultipleTabManager } from "firebase/firestore";
import { app } from "./firebaseConfig";

// Enable multi-tab persistent IndexedDB cache on web
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({
    tabManager: persistentMultipleTabManager()
  })
});`,
    explanation:
      "Offline persistence delivers instant app load times and seamless offline user experiences without writing custom caching layers.",
    moduleSlug: "offline-persistence",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How do Firestore composite indexes work and why does Firestore reject unindexed compound queries?",
    answer:
      "Firestore guarantees that query performance is proportional to the size of the result set, not the size of the database. For queries that filter or sort on multiple distinct fields (compound queries), Firestore requires a composite index.\n\nIf you run an unindexed query, Firestore returns an error containing a direct clickable URL to generate the required index in the Firebase Console.",
    example: `import { query, collection, where, orderBy, getDocs } from "firebase/firestore";

// Requires Composite Index: status (Ascending) + createdAt (Descending)
const q = query(
  collection(db, "tickets"),
  where("status", "==", "OPEN"),
  where("priority", "==", "HIGH"),
  orderBy("createdAt", "desc")
);

const querySnapshot = await getDocs(q);`,
    explanation:
      "Firestore constructs index entries combining all three fields, enabling single-scan index queries that return instantly regardless of collection size.",
    moduleSlug: "firestore-queries-indexes",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does Google Analytics for Firebase track user engagement and conversion events?",
    answer:
      "Firebase Analytics provides free, unlimited app event logging and user behavior analytics across platforms.\n\nEvents can include predefined ecommerce metrics (`purchase`, `add_to_cart`) or custom application events with custom parameters for user segmentation and funnel analysis.",
    example: `import { getAnalytics, logEvent } from "firebase/analytics";

const analytics = getAnalytics();

// Log user purchase event
logEvent(analytics, "purchase", {
  transaction_id: "T12345",
  value: 49.99,
  currency: "USD",
  items: [{ item_id: "SKU_77", item_name: "Pro Membership" }]
});`,
    explanation:
      "Logged events integrate with Google Analytics, BigQuery exports, and Firebase Remote Config for targeted user personalization.",
    moduleSlug: "firebase-analytics",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does Firebase Remote Config enable dynamic feature flagging and A/B testing?",
    answer:
      "Firebase Remote Config allows developers to change app behavior and appearance dynamically from the cloud without releasing a new app store version or redeploying code.\n\nYou define default values in client code, and the SDK periodically fetches remote parameter overrides based on conditions (user percentage, country, language, device platform).",
    example: `import { getRemoteConfig, getValue, fetchAndActivate } from "firebase/remote-config";

const remoteConfig = getRemoteConfig();
remoteConfig.settings.minimumFetchIntervalMillis = 3600000; // 1 hour

await fetchAndActivate(remoteConfig);

const isNewCheckoutEnabled = getValue(remoteConfig, "enable_v2_checkout").asBoolean();
if (isNewCheckoutEnabled) {
  renderV2Checkout();
} else {
  renderV1Checkout();
}`,
    explanation:
      "Remote Config allows rolling out risky features to 10% of users first, monitoring crash rates, and instantly rolling back with one click if errors occur.",
    moduleSlug: "remote-config",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How does the Firebase Local Emulator Suite accelerate development and testing?",
    answer:
      "The Firebase Emulator Suite runs local instances of Firestore, Authentication, Functions, Storage, Realtime Database, and Hosting on your local machine.\n\nIt enables offline local development, fast integration tests, and guarantees developers do not pollute or incur costs on live production cloud projects.",
    example: `import { getFirestore, connectFirestoreEmulator } from "firebase/firestore";
import { getAuth, connectAuthEmulator } from "firebase/auth";

const db = getFirestore();
const auth = getAuth();

if (process.env.NODE_ENV === "development") {
  // Connect to local emulators running on localhost
  connectFirestoreEmulator(db, "127.0.0.1", 8080);
  connectAuthEmulator(auth, "http://127.0.0.1:9099");
}`,
    explanation:
      "Tests run against the local emulator execute in milliseconds and can be completely reset between test runs without network calls.",
    moduleSlug: "firebase-emulator-suite",
    category: "firebase",
    language: "javascript",
  },
  {
    question:
      "How do Firestore background triggers (onCreate, onUpdate, onDelete) operate in Cloud Functions?",
    answer:
      "Firestore background triggers execute asynchronously on Google Cloud whenever a document in a specified collection path is created, modified, or deleted.\n\n• `onDocumentCreated`: Triggers when a new document is inserted.\n• `onDocumentUpdated`: Provides `event.data.before` and `event.data.after` snapshots.\n• `onDocumentDeleted`: Triggers when a document is deleted.",
    example: `import { onDocumentCreated } from "firebase-functions/v2/firestore";
import { getFirestore } from "firebase-admin/firestore";

export const sendWelcomeEmailOnUserCreated = onDocumentCreated(
  "users/{userId}",
  async (event) => {
    const newUser = event.data.data();
    console.log("New user registered:", newUser.email);
    
    // Add an audit log or trigger welcome email service
    const db = getFirestore();
    await db.collection("mail_queue").add({
      to: newUser.email,
      template: "welcome_email",
      sentAt: new Date()
    });
  }
);`,
    explanation:
      "Background triggers ensure event-driven decoupling: creating a user document automatically triggers secondary asynchronous workflows like email sending or audit logging.",
    moduleSlug: "triggers-oncreateonwrite",
    category: "firebase",
    language: "typescript",
  },
  {
    question:
      "How does Firebase Performance Monitoring help diagnose app latency in production?",
    answer:
      "Firebase Performance Monitoring automatically tracks app startup times, HTTP network request success rates and latencies, and screen rendering performance (slow and frozen frames) on real user devices.\n\nDevelopers can also define Custom Code Traces to measure the duration of critical application operations.",
    example: `import { getPerformance, trace } from "firebase/performance";

const perf = getPerformance();
const loadFeedTrace = trace(perf, "feed_load_operation");

loadFeedTrace.start();
try {
  await fetchUserSocialFeed();
} finally {
  loadFeedTrace.stop(); // Records execution duration to Firebase Console
}`,
    explanation:
      "Custom code traces report real-world performance broken down by device model, country, and network connection speed (WiFi vs Cellular).",
    moduleSlug: "firebase-performance-monitoring",
    category: "firebase",
    language: "javascript",
  },
];
