/* 自动生成，请勿直接修改！
   源文件：data/*.json    生成脚本：scripts/build_bank.py */
window.UNITY_BANK = [
 {
  "id": "cs-01",
  "cat": "cs",
  "level": "基础",
  "type": "judge",
  "q": "在 C# 中 struct 是值类型，因此它的实例一定分配在线程栈上。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "struct 是值类型不假，但“值类型一定在栈上”是常见误解：值类型分配在声明它的位置。局部变量在栈上，作为 class 字段时随对象在堆上，作为数组元素时内联在数组里，被闭包捕获或装箱后也会到堆上。所以栈还是堆取决于上下文，类型本身只决定拷贝语义。面试常追问 struct 内嵌引用类型字段时的内存布局，以及为什么大 struct 传参要加 in。",
  "tags": [
   "值类型",
   "栈与堆",
   "内存布局"
  ]
 },
 {
  "id": "cs-02",
  "cat": "cs",
  "level": "基础",
  "type": "single",
  "q": "关于 struct 与 class 的区别，下列说法正确的是？",
  "options": [
   "struct 可以定义无参构造函数，class 不可以",
   "struct 是值语义，赋值和传参时复制整个实例；class 是引用语义，复制的是引用",
   "struct 支持继承，因此可以复用基类的字段和方法",
   "struct 实例一定比 class 实例占用更少内存"
  ],
  "answer": [
   1
  ],
  "explain": "struct 是值语义，赋值和传参复制实例本身；class 变量存的是堆对象引用，复制只复制引用。struct 不能继承类也不能被继承，只能实现接口，C# 10 起才允许显式无参构造函数。占用内存要看字段构成，含多个引用字段的 struct 未必比小 class 省，而且 struct 作为字段或数组元素时按值内联。面试常追问什么时候该用 struct（小、不可变、短生命周期），以及 mutable struct 的坑。",
  "tags": [
   "struct",
   "class",
   "值语义"
  ]
 },
 {
  "id": "cs-03",
  "cat": "cs",
  "level": "基础",
  "type": "single",
  "q": "下面代码的输出以及其中的装箱、拆箱过程，描述正确的是？",
  "code": "object boxed = 42;\nint unboxed = (int)boxed;\nboxed = 43;\nConsole.WriteLine(unboxed);",
  "options": [
   "输出 43；boxed 与 unboxed 指向同一块内存",
   "输出 42；装箱在堆上分配并复制值，拆箱做类型检查后再次复制值，两者互不影响",
   "输出 42；拆箱只是引用转换，不会复制",
   "输出 43；编译器把装箱优化成了栈上存储"
  ],
  "answer": [
   1
  ],
  "explain": "装箱把值类型复制到堆上的 object，拆箱先检查类型再复制回栈上的变量，所以后续修改 boxed 不会影响 unboxed。装箱有堆分配和拷贝成本，热路径应使用泛型集合（List<int>）避免。注意拆箱必须拆成精确的原始类型，拆成 long 或 enum 会抛 InvalidCastException。面试常追问 Dictionary<int, string> 用 int 做 key 是否装箱，以及 struct 传给接口参数为什么会装箱。",
  "tags": [
   "装箱",
   "拆箱",
   "值类型"
  ]
 },
 {
  "id": "cs-04",
  "cat": "cs",
  "level": "基础",
  "type": "single",
  "q": "在每帧执行、循环上千次的日志拼接场景中，下列做法最合适的是？",
  "code": "string s = \"\";\nfor (int i = 0; i < 1000; i++)\n    s += i;",
  "options": [
   "继续用 s += i，因为编译器会把循环内的拼接合并成一次分配",
   "改用 StringBuilder，循环外创建并复用实例，循环内 Append，必要时 Clear()",
   "改用 string.Concat 在循环内两两拼接",
   "改用 string.Format，它内部使用可变缓冲区，不会产生新字符串"
  ],
  "answer": [
   1
  ],
  "explain": "string 不可变，每次 += 都产生新字符串并复制旧内容，1000 次循环是 O(n²) 级别的拷贝和大量 GC 垃圾。StringBuilder 内部维护可变 char 缓冲区，容量不足才扩容，适合循环拼接；跨帧复用时记得 Clear()。string.Concat 和 string.Format 同样每次返回新字符串，Format 还有装箱和解析开销。面试常追问 StringBuilder 的默认容量与扩容策略，以及 Unity 中怎么做到每帧零分配拼接。",
  "tags": [
   "string",
   "StringBuilder",
   "GC"
  ]
 },
 {
  "id": "cs-05",
  "cat": "cs",
  "level": "基础",
  "type": "single",
  "q": "关于字段（field）与属性（property）的选择，下列说法正确的是？",
  "options": [
   "public 字段与 public 自动属性编译出的 IL 完全一样，可以随意互换",
   "属性本质是方法，便于加校验、懒加载和变更通知；公开字段破坏封装，且后续改成属性会破坏二进制兼容与序列化",
   "属性一定比字段慢一个数量级，性能敏感代码应全部改用 public 字段",
   "自动属性不能写初始化器，必须在构造函数里赋值"
  ],
  "answer": [
   1
  ],
  "explain": "自动属性由编译器生成 backing field 加 get/set 方法，JIT 内联后与字段访问开销几乎相同，所以“属性一定慢”不成立。真正的区别在演进能力：字段改成属性会改变 IL 签名，破坏已编译程序集和部分序列化；属性还能加校验、通知和访问控制。Unity 的 Inspector 只序列化字段，属性需要 [field: SerializeField] 或手写 backing field。面试常追问为什么 Unity 不序列化属性，以及 init、record 与不可变对象。",
  "tags": [
   "属性",
   "字段",
   "封装"
  ]
 },
 {
  "id": "cs-06",
  "cat": "cs",
  "level": "基础",
  "type": "single",
  "q": "关于 ref、out、in 与 params，下列说法正确的是？",
  "options": [
   "ref 和 out 在调用前都必须先初始化实参",
   "out 要求方法内必须赋值，ref 要求传入前已初始化；in 是只读引用，适合传递较大的 struct 避免拷贝",
   "in 参数在方法内可以重新赋值，只是不能取地址",
   "params 只能用于值类型数组，并且每次调用都不会产生分配"
  ],
  "answer": [
   1
  ],
  "explain": "ref 是双向的、传入前必须初始化；out 是单向输出、方法内必须赋值；in 按只读引用传递，避免大 struct 拷贝，但在 struct 上调用非 readonly 成员会触发 defensive copy。params 每次调用通常会新建数组（直接传数组或 C# 13 的 params ReadOnlySpan 可避免），是常见的隐性分配。面试常追问 ref struct 与 Span 的限制、ref return 的生命周期安全，以及 async 方法为什么不能用 ref/out。",
  "tags": [
   "ref",
   "out",
   "in",
   "params"
  ]
 },
 {
  "id": "cs-07",
  "cat": "cs",
  "level": "基础",
  "type": "single",
  "q": "关于 C# 的 delegate 与 event，下列说法正确的是？",
  "options": [
   "event 只是 delegate 字段的语法糖，外部代码可以直接赋值和调用",
   "event 对外只暴露 += 和 -=，外部不能赋值或触发；只有声明类内部才能调用，从而保护订阅列表",
   "一个 delegate 实例只能绑定一个方法，绑定多个需要多个实例",
   "delegate 是可变引用类型，用 -= 移除不存在的处理器会抛异常"
  ],
  "answer": [
   1
  ],
  "explain": "event 编译后是私有委托字段加 add/remove 访问器，外部只能订阅和退订，触发只能在声明类内部，否则任何代码都能把订阅列表清空。委托是不可变的多播类型，+= 和 -= 实际调用 Delegate.Combine/Remove 生成新委托；-= 移除不存在的处理器不会抛异常，只是无操作。常见坑是订阅后忘记退订，导致发布者持有订阅者引用而无法回收。面试常追问 UnityEvent 与 C# event 的差异、弱事件模式，以及对象池复用时的事件重复订阅。",
  "tags": [
   "delegate",
   "event",
   "多播"
  ]
 },
 {
  "id": "cs-08",
  "cat": "cs",
  "level": "基础",
  "type": "judge",
  "q": "abstract 方法只有声明没有实现，virtual 方法必须有实现，sealed 修饰符可以阻止派生类继续重写。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "abstract 成员只能出现在抽象类中，派生类必须 override（除非派生类也是 abstract）；virtual 提供默认实现，派生类可选择重写；sealed override 关闭后续重写，sealed class 则禁止继承。注意 new 是编译期隐藏，override 才是运行期多态，用基类引用调用时行为完全不同。面试常追问接口默认实现（C# 8）、重写时调用 base，以及 sealed 对内联和性能的影响。",
  "tags": [
   "virtual",
   "abstract",
   "sealed"
  ]
 },
 {
  "id": "cs-09",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "关于 .NET 的分代垃圾回收（GC），下列说法正确的是？",
  "options": [
   "Gen0 满了就会触发 Full GC，把所有代的对象一起回收",
   "新对象进入 Gen0，存活对象晋升到 Gen1/Gen2；Gen0/Gen1 回收频繁且快，Gen2 回收代价最大",
   "大于等于 85KB 的大对象分配在 Gen2，所以 LOH 也会随 Gen0 一起压缩",
   "调用 GC.Collect() 只回收 Gen0，对性能没有影响"
  ],
  "answer": [
   1
  ],
  "explain": "分代基于“大多数对象很快死亡”的弱代假设：Gen0 预算小、回收快，存活对象晋升；Gen2 包含长生命周期对象，回收最贵。大于等于 85KB 的对象进入大对象堆（LOH），逻辑上属于 Gen2，但默认不压缩，容易产生碎片。GC.Collect() 强制完整回收，在 Unity 里往往造成明显卡顿，不应随手调用。面试常追问 Unity 的增量 GC 如何把一次回收拆到多帧、LOH 碎片怎么缓解，以及 GC 与 Dispose 的关系。",
  "tags": [
   "GC",
   "分代",
   "LOH"
  ]
 },
 {
  "id": "cs-10",
  "cat": "cs",
  "level": "进阶",
  "type": "multi",
  "q": "关于 IDisposable、using 与 finalizer，下列说法正确的有？",
  "options": [
   "using 编译为 try/finally，作用域结束或抛异常都会调用 Dispose()",
   "finalizer 由 GC 在不确定的时间点调用，且会让对象多存活一轮 GC 才被真正回收",
   "只要类实现了 IDisposable，就必须同时定义 finalizer",
   "Dispose 模式中通常调用 GC.SuppressFinalize(this)，避免已释放对象再次进入终结队列"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "using 是 try/finally 的语法糖，异常路径也会释放；finalizer 运行在专用线程、时机不确定，带 finalizer 的对象至少要经过两次 GC 才能回收，所以只在持有非托管资源时才需要。完整 Dispose 模式在 Dispose(bool) 中区分托管与非托管资源，并调用 GC.SuppressFinalize 避免重复清理。只包装托管对象的类实现 Dispose 就够了，不需要 finalizer。面试常追问 Unity 中 AssetBundle、FileStream 忘记 Dispose 的后果，以及 Destroy 与 Dispose 的区别。",
  "tags": [
   "IDisposable",
   "using",
   "finalizer"
  ]
 },
 {
  "id": "cs-11",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "上面代码的输出是？",
  "code": "var actions = new List<Action>();\nfor (int i = 0; i < 3; i++)\n    actions.Add(() => Console.WriteLine(i));\nforeach (var a in actions) a();",
  "options": [
   "0 1 2",
   "3 3 3",
   "0 0 0",
   "编译错误：lambda 不能捕获循环变量"
  ],
  "answer": [
   1
  ],
  "explain": "闭包捕获的是变量而不是值：for 循环的 i 在整个循环中只有一份，被编译器提升为闭包类的字段，循环结束后值为 3，所以三个 lambda 都打印 3。C# 5 起 foreach 的迭代变量是每轮新变量，因此 foreach 里捕获不会出现这个问题，但 for 仍会。修复方式是在循环体内写 int copy = i; 再捕获 copy。面试常追问闭包带来的堆分配（Unity 每帧 new 委托导致 GC）、闭包延长变量生命周期，以及事件订阅中的闭包引用泄漏。",
  "tags": [
   "闭包",
   "lambda",
   "捕获"
  ]
 },
 {
  "id": "cs-12",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "关于 Unity 协程与 async/await、Task 的区别，下列说法正确的是？",
  "options": [
   "协程由 Unity 主线程按帧推进，不是真正的多线程；async/await 默认回到 SynchronizationContext（Unity 主线程），只有 Task.Run 才把工作丢到线程池",
   "协程内部可以用 try/catch 包住 yield return，从而捕获后续帧的异常",
   "async 方法一定在后台线程执行，所以可以在其中直接访问 Transform",
   "Task 和协程一样受 GameObject 生命周期管理，对象销毁后会自动取消"
  ],
  "answer": [
   0
  ],
  "explain": "协程是挂在 MonoBehaviour 上的迭代器，由 Unity 主线程逐帧 MoveNext，对象销毁或 GameObject 失活就会停止；它不能返回值，也不好做超时和取消。async/await 基于 Task，默认在调用方的 SynchronizationContext 上恢复，所以 Unity 里 await 之后仍在主线程，Task.Run 里的代码才在线程池，不能碰 Unity API。async 方法不受 GameObject 生命周期约束，对象销毁后回调仍可能执行，需要 CancellationToken 和销毁检查。面试常追问 async void 的异常陷阱、UniTask 如何做到零 GC，以及协程与 async 如何互相等待。",
  "tags": [
   "协程",
   "async",
   "Task"
  ]
 },
 {
  "id": "cs-13",
  "cat": "cs",
  "level": "进阶",
  "type": "judge",
  "q": "LINQ 的 Where、Select 等查询在定义时就会立即执行，并把结果保存在集合中。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Where/Select 返回的是延迟执行的迭代器，只有 foreach、ToList、Count、First 等触发枚举时才真正执行，而且每次枚举都会重新执行一遍。这既是优点（可组合、按需计算），也是坑：数据源在两次枚举之间变化会导致结果不一致，重复枚举还会带来重复计算或重复数据库查询。面试常追问 IEnumerable 与 IQueryable 的区别（委托 vs 表达式树），以及如何在 Unity 里避免 LINQ 的迭代器和闭包分配。",
  "tags": [
   "LINQ",
   "延迟执行",
   "迭代器"
  ]
 },
 {
  "id": "cs-14",
  "cat": "cs",
  "level": "进阶",
  "type": "multi",
  "q": "关于 C# 泛型约束，下列说法正确的有？",
  "options": [
   "where T : struct 要求 T 是非可空值类型，Nullable<T> 不满足该约束",
   "where T : new() 必须放在约束列表的最后",
   "where T : IFoo 会让 T 在调用接口成员时发生装箱",
   "泛型对值类型实参会为每个 T 生成独立的 JIT 代码，引用类型实参则共享同一份"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "struct 约束排除可空值类型；new() 必须放在最后，且不能与 struct 约束同时使用；接口约束配合值类型时，CLR 通过 constrained. 前缀直接调用，不会装箱。值类型每个实参生成一份代码，可能带来代码膨胀，引用类型则共享。面试常追问协变逆变（out/in）、泛型类型和泛型方法的静态字段是否共享，以及为什么 List<T> 对 struct 不装箱。",
  "tags": [
   "泛型",
   "约束",
   "JIT"
  ]
 },
 {
  "id": "cs-15",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "关于 Dictionary<TKey, TValue> 的内部实现，下列说法正确的是？",
  "options": [
   "Dictionary 直接用哈希值作为数组下标，所以查找永远是 O(1) 且没有冲突",
   "Dictionary 用桶数组加 Entry 数组（冲突用 next 链串起来），扩容时重新分配并 rehash；默认容量为 0，首次插入才分配",
   "Dictionary 保证按插入顺序遍历，删除元素后顺序仍然稳定",
   "Dictionary 的 key 必须是值类型，引用类型做 key 会退化为线性查找"
  ],
  "answer": [
   1
  ],
  "explain": "哈希值会先对桶数量取模，冲突时沿 Entry 的 next 链逐个比较 key，最坏情况退化为 O(n)，所以“永远 O(1)”不成立。默认构造函数不分配数组，第一次 Add 才按扩容策略分配；扩容时重新计算所有 entry 的桶位置。遍历顺序是实现细节，不保证插入顺序，删除后还会留下空洞。面试常追问预设 capacity 减少扩容、自定义 IEqualityComparer，以及 string key 的哈希随机化。",
  "tags": [
   "Dictionary",
   "哈希",
   "扩容"
  ]
 },
 {
  "id": "cs-16",
  "cat": "cs",
  "level": "进阶",
  "type": "judge",
  "q": "如果两个对象 Equals 返回 true，它们的 GetHashCode 必须相同；反过来，GetHashCode 相同的两个对象 Equals 也必须为 true。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "前半句是契约：Equals 相等必须产生相同哈希，否则 Dictionary/HashSet 会找不到对象。后半句不成立：不同对象哈希相同只是冲突，集合会再用 Equals 精确比较。重写 Equals 必须同时重写 GetHashCode，否则默认实现基于引用地址，相等对象会落到不同桶。用可变对象做 key 后修改参与哈希的字段，会导致再也查不到，这是实际项目里很常见的坑。面试常追问 HashSet 去重依赖什么、哈希分布差导致链表退化，以及 record 自动生成的 Equals/GetHashCode。",
  "tags": [
   "Equals",
   "GetHashCode",
   "HashSet"
  ]
 },
 {
  "id": "cs-17",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "上面代码的输出顺序是？",
  "code": "IEnumerable<int> GetNumbers()\n{\n    Console.WriteLine(\"A\");\n    yield return 1;\n    Console.WriteLine(\"B\");\n    yield return 2;\n    Console.WriteLine(\"C\");\n}\n\nvar e = GetNumbers();\nConsole.WriteLine(\"D\");\nforeach (var n in e) { }",
  "options": [
   "A B C D",
   "D A B C",
   "D A C B",
   "A D B C"
  ],
  "answer": [
   1
  ],
  "explain": "调用 GetNumbers() 只是创建迭代器状态机对象，方法体一行都没执行，所以先打印 D。第一次 MoveNext 才执行到第一个 yield return，打印 A 并返回 1；第二次打印 B 返回 2；第三次打印 C 后方法结束。这说明 yield 方法是延迟执行的，而且每次调用返回的是新的迭代器实例。面试常追问迭代器为什么实现 IDisposable、try/finally 在迭代器中的执行时机，以及 Unity 协程如何基于迭代器实现。",
  "tags": [
   "yield",
   "IEnumerable",
   "延迟执行"
  ]
 },
 {
  "id": "cs-18",
  "cat": "cs",
  "level": "进阶",
  "type": "single",
  "q": "关于 C# 异常处理的性能，下列说法正确的是？",
  "options": [
   "try/catch 本身几乎零开销，只有 throw 时才付出成本，因此可以用异常做常规流程控制",
   "throw 需要捕获调用栈并展开栈帧，代价很高；热路径应改用 TryParse、返回值或状态码，避免用异常控制流程",
   "catch 到异常后写 throw ex 可以保留原始堆栈，性能更好",
   "异常在 Unity 中不会产生 GC 分配，也不会影响帧率"
  ],
  "answer": [
   1
  ],
  "explain": "进入 try 块只有很小的准备开销，真正昂贵的是 throw：构造异常对象、记录堆栈、展开调用栈，在热路径上会明显拖慢甚至造成卡顿。throw ex 会重置堆栈起点，丢失原始抛出位置，应该用 throw 重新抛出。Unity 中异常还会触发日志和 GC，频繁抛出会污染 Console 并影响性能。面试常追问 int.Parse 与 int.TryParse 的差异、async 方法中异常如何传播，以及 first-chance 异常怎么排查。",
  "tags": [
   "异常",
   "性能",
   "try-catch"
  ]
 },
 {
  "id": "cs-19",
  "cat": "cs",
  "level": "高级",
  "type": "single",
  "q": "在 Unity 项目中，下列哪种做法最可能造成明显的 GC 卡顿？",
  "options": [
   "每帧 new 一个 100KB 的 byte[] 做网络包缓冲，用完即弃",
   "在 Awake 中按预估容量初始化 List，并在后续复用",
   "用对象池复用子弹和特效实例",
   "把不变的字符串放在 static readonly 字段里"
  ],
  "answer": [
   0
  ],
  "explain": "100KB 超过 85KB 的 LOH 阈值，每帧分配会不断产生大对象，LOH 默认不压缩，回收成本高且容易碎片化，直接表现为周期性卡顿。正确做法是预分配缓冲区或用 ArrayPool 复用，避免每帧 new 大数组。小对象频繁分配同样会造成 Gen0 压力，只是单次成本低。面试常追问 Profiler 里 GC Alloc 列怎么用、增量 GC 的局限，以及 struct 数组与 class 数组的内存布局差异。",
  "tags": [
   "GC",
   "LOH",
   "Unity"
  ]
 },
 {
  "id": "cs-20",
  "cat": "cs",
  "level": "高级",
  "type": "single",
  "q": "关于反射与特性（Attribute），下列说法正确的是？",
  "options": [
   "MethodInfo.Invoke 需要装箱参数、分配 object[] 并做运行时绑定，热路径应缓存 MethodInfo 或改用委托、源生成器",
   "特性只能在编辑器下读取，运行时完全不可见",
   "GetCustomAttributes 返回的是缓存的单例，修改返回的实例会影响后续调用",
   "反射可以访问 private 成员，因此调用开销与直接调用相同"
  ],
  "answer": [
   0
  ],
  "explain": "Invoke 的参数是 object[]，值类型参数和返回值都会装箱，还有参数校验和绑定的开销，比直接调用慢一两个数量级；缓存 MethodInfo、用 Delegate.CreateDelegate 或表达式树、源生成器可以显著降低。每次 GetCustomAttributes 默认都会新建特性实例，需要缓存。Unity 的 [SerializeField]、[Range] 是编辑器读取，IL2CPP 下反射还会受代码裁剪影响。面试常追问 link.xml 与 AOT、为什么移动端反射要谨慎，以及依赖注入容器怎么优化。",
  "tags": [
   "反射",
   "Attribute",
   "性能"
  ]
 },
 {
  "id": "cs-21",
  "cat": "cs",
  "level": "高级",
  "type": "multi",
  "q": "关于 StructLayout、fixed 缓冲区和 unsafe，下列说法正确的有？",
  "options": [
   "[StructLayout(LayoutKind.Sequential, Pack = 1)] 可以去掉字段间的对齐填充，常用于与 C/C++ 结构体或网络协议二进制对齐",
   "LayoutKind.Explicit 配合 [FieldOffset] 可以让多个字段共享同一块内存，实现联合体效果",
   "fixed 缓冲区只能用在 unsafe 上下文中的 struct 里，元素类型限定为基元类型",
   "Marshal.SizeOf 与 sizeof 对所有 struct 都返回相同的值"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Sequential 默认按最大字段对齐插入填充，Pack=1 去掉填充，但可能带来非对齐访问的性能损失甚至部分平台异常。Explicit 用 FieldOffset 精确布局，重叠引用类型字段会破坏 GC 追踪，必须非常谨慎。fixed 用于在 struct 内内联固定长度数组，只能在 unsafe 中使用。Marshal.SizeOf 返回非托管封送后的大小（例如 bool 封送为 4 字节），与 sizeof 的托管布局不一定相同。面试常追问 blittable 类型、Burst/Job System 对布局的要求，以及 NativeArray 与 GC 追踪。",
  "tags": [
   "StructLayout",
   "unsafe",
   "内存布局"
  ]
 },
 {
  "id": "cs-22",
  "cat": "cs",
  "level": "高级",
  "type": "judge",
  "q": "Unity 默认在每次进入 Play Mode 时重载 AppDomain，static 字段会被重置；因此用 static 字段做单例或缓存时，关闭 Domain Reload 后要特别注意残留状态。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "默认情况下进入 Play Mode 会重载域，所有 static 字段回到初始值，所以很多人依赖这一点“自动清理”单例。但在 Enter Play Mode Options 里关闭 Domain Reload 后，static 会跨次保留，单例不为空、事件重复订阅、缓存脏数据等问题会集中出现。稳妥做法是显式初始化（RuntimeInitializeOnLoadMethod）并在 OnDisable/OnDestroy 退订清理，而不是依赖域重载。面试常追问 DontDestroyOnLoad 单例、双检锁与 Lazy<T>，以及静态构造函数在域重载后的执行时机。",
  "tags": [
   "static",
   "单例",
   "DomainReload"
  ]
 },
 {
  "id": "cs-23",
  "cat": "cs",
  "level": "高级",
  "type": "multi",
  "q": "关于可空引用类型（nullable reference types）与 Nullable<T>，下列说法正确的有？",
  "options": [
   "int? 是 Nullable<int> 的语法糖，是值类型；装箱时 null 变成空引用，有值则装箱为 int",
   "启用可空引用类型后，string? 在运行时是独立类型，可以用来做重载决议",
   "可空引用类型的警告只来自编译器的静态流分析，运行时不会自动插入空检查",
   "空包容运算符 ! 会在运行时校验并在 null 时抛 NullReferenceException"
  ],
  "answer": [
   0,
   2
  ],
  "explain": "Nullable<T> 是 struct，有值和 null 两种状态，装箱规则特殊：null 装箱得到空引用，有值装箱为底层类型。可空引用类型只是编译期标注和流分析，string? 与 string 在运行时是同一个类型，元数据里只多了 attribute，所以不能用于重载。! 运算符只抑制警告，不生成任何运行时检查。面试常追问 ?. 与 ?? 的短路、Nullable<T>.Value 抛异常，以及 Unity 序列化为什么不支持可空类型。",
  "tags": [
   "Nullable",
   "可空引用",
   "空安全"
  ]
 },
 {
  "id": "cs-24",
  "cat": "cs",
  "level": "高级",
  "type": "multi",
  "q": "以下写法中，会在运行时产生装箱（boxing）或额外堆分配的有？",
  "options": [
   "ArrayList list = new ArrayList(); list.Add(1);",
   "List<int> list = new List<int>(); list.Add(1);",
   "foreach (object o in new List<int> { 1, 2, 3 }) { }",
   "void Foo(IFoo f) 传入一个实现了 IFoo 的 struct 实例"
  ],
  "answer": [
   0,
   2,
   3
  ],
  "explain": "ArrayList 的 Add 接收 object，int 传进去会装箱；List<int> 是泛型，元素按 int 内联存储，不装箱。foreach 里用 object 接收 int 元素，每次迭代都会装箱；struct 转接口参数同样装箱，因为接口引用需要对象头。要消除后者可以用泛型方法加 where T : IFoo，让 CLR 走 constrained 调用。面试常追问字符串拼接 int 是否装箱（Concat 有 int 重载）、枚举做 Dictionary key 的开销，以及如何用泛型约束在 Unity 热路径里做到零装箱。",
  "tags": [
   "装箱",
   "泛型",
   "性能"
  ]
 },
 {
  "id": "engine-01",
  "cat": "engine",
  "level": "基础",
  "type": "single",
  "q": "一个默认激活的 GameObject 上挂有这个脚本。首次进入游戏时，控制台四条日志的先后顺序是？",
  "code": "void Awake()    { Debug.Log(\"Awake\"); }\nvoid OnEnable() { Debug.Log(\"OnEnable\"); }\nvoid Start()    { Debug.Log(\"Start\"); }\nvoid Update()   { Debug.Log(\"Update\"); }",
  "options": [
   "Awake → OnEnable → Start → Update",
   "Awake → Start → OnEnable → Update",
   "OnEnable → Awake → Start → Update",
   "Start → Awake → OnEnable → Update"
  ],
  "answer": [
   0
  ],
  "explain": "Awake 在对象实例加载时调用，先于 OnEnable；OnEnable 在组件变为启用状态时调用；Start 在该组件第一次启用后、第一次 Update 之前调用且只调用一次。因此首次激活的顺序是 Awake、OnEnable、Start、Update。若中途 SetActive(false) 再激活，会再次触发 OnEnable，但不会再次触发 Awake 和 Start。",
  "tags": [
   "生命周期",
   "Awake",
   "OnEnable",
   "Start"
  ]
 },
 {
  "id": "engine-02",
  "cat": "engine",
  "level": "基础",
  "type": "single",
  "q": "把 Time.timeScale 设为 0 后，下列哪一项仍会按渲染帧执行？",
  "options": [
   "FixedUpdate",
   "Update",
   "物理模拟",
   "OnCollisionEnter"
  ],
  "answer": [
   1
  ],
  "explain": "timeScale 会缩放 Time.deltaTime，并决定物理时间如何累积；设为 0 时物理模拟暂停，FixedUpdate 不再按固定步长调用，碰撞回调也不会产生。Update 仍然每个渲染帧执行，只是 Time.deltaTime 变成 0，所以基于 deltaTime 的移动会停住。此时做 UI 动画或倒计时应改用 Time.unscaledDeltaTime / WaitForSecondsRealtime。",
  "tags": [
   "Time.timeScale",
   "FixedUpdate",
   "Update",
   "物理暂停"
  ]
 },
 {
  "id": "engine-03",
  "cat": "engine",
  "level": "基础",
  "type": "single",
  "q": "以下哪种修改能让 speed 继续表示“米/秒”，并且移动距离不随渲染帧率变化？",
  "code": "public float speed = 5f;\n\nvoid Update()\n{\n    transform.position += Vector3.forward * speed;\n}",
  "options": [
   "transform.position += Vector3.forward * speed * Time.deltaTime;",
   "transform.position += Vector3.forward * speed * Time.fixedDeltaTime;",
   "把这段代码原样移到 FixedUpdate 中即可，不需要再乘时间。",
   "把 speed 乘以 Time.frameCount。"
  ],
  "answer": [
   0
  ],
  "explain": "Update 的调用间隔随帧率变化，直接用 speed 表示“每帧移动 speed 米”，帧率越高移动越快。乘以 Time.deltaTime 后，speed 才表示“每秒移动 speed 米”，且 deltaTime 已包含 timeScale 的影响。在 FixedUpdate 中若要按秒描述速度，同样应乘 Time.fixedDeltaTime，而不是依赖固定步长自动换算。",
  "tags": [
   "Time.deltaTime",
   "帧率无关",
   "Update"
  ]
 },
 {
  "id": "engine-04",
  "cat": "engine",
  "level": "基础",
  "type": "single",
  "q": "关于 MonoBehaviour 与 ScriptableObject 的核心区别，哪项正确？",
  "options": [
   "ScriptableObject 继承 UnityEngine.Object 但不是 Component，不能挂到 GameObject 上，通常作为可序列化数据资产在多个引用者之间共享。",
   "ScriptableObject 必须挂在一个空 GameObject 上才能保存数据。",
   "MonoBehaviour 不能保存为资产，因此不能用来做配置数据。",
   "ScriptableObject 也有每帧自动调用的 Update，适合直接当作全局管理器。"
  ],
  "answer": [
   0
  ],
  "explain": "ScriptableObject 是独立于场景对象的 Unity 资产，没有 Transform，也没有 Update 这类每帧回调，优势是共享配置和减少重复数据。它被多个对象引用时是同一份实例，运行时修改会互相影响，在编辑器里还可能把改动写回资产，所以可变运行时状态要谨慎存放。MonoBehaviour 同样可以作为 Prefab 资产保存，只是它必须依附于 GameObject。",
  "tags": [
   "ScriptableObject",
   "MonoBehaviour",
   "数据资产"
  ]
 },
 {
  "id": "engine-05",
  "cat": "engine",
  "level": "基础",
  "type": "multi",
  "q": "关于 GameObject 与 Component 的组合关系，哪些说法正确？",
  "options": [
   "GameObject 本身只是容器，具体行为由挂载的 Component 提供。",
   "每个 GameObject 都有一个 Transform（UI 下是 RectTransform），它是不可移除的核心组件。",
   "同一 GameObject 可以挂多个不同脚本；是否允许重复添加同类型组件由组件的 DisallowMultipleComponent 等规则决定。",
   "同一 GameObject 可以添加两个 Rigidbody，让两个刚体分别参与物理模拟。"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Unity 采用组合而非继承：GameObject 是实体容器，功能由 Component 拼装，脚本也是 Component。Transform 是每个 GameObject 的必需组件，UI 对象使用其子类 RectTransform；没有 Transform 的 GameObject 在 Unity 中不存在。Rigidbody 这类组件不允许同一对象重复添加，添加第二个会被拒绝或替换，因此第四项错误。",
  "tags": [
   "GameObject",
   "Component",
   "组合模式",
   "Transform"
  ]
 },
 {
  "id": "engine-06",
  "cat": "engine",
  "level": "基础",
  "type": "single",
  "q": "父物体同时有旋转和缩放，子物体需要沿世界 Y 轴精确移动；该逻辑每帧执行。以下哪种实现最稳妥？",
  "code": "private Transform _t;\n\nvoid Awake()\n{\n    _t = transform;\n}\n\nvoid Update()\n{\n    // 每帧让子物体在世界空间沿 Y 轴移动\n}",
  "options": [
   "_t.localPosition += Vector3.up * Time.deltaTime;",
   "_t.position += Vector3.up * Time.deltaTime;",
   "_t.Translate(Vector3.up * Time.deltaTime);",
   "_t.position = new Vector3(_t.position.x, 1f, _t.position.z);"
  ],
  "answer": [
   1
  ],
  "explain": "Transform.position 使用世界坐标，直接加上世界方向的 Vector3.up 不受父物体旋转和缩放影响。localPosition 位于父物体局部空间，Translate 默认也是 Space.Self，父物体一旦旋转，实际移动方向就会偏。把 transform 在 Awake 中缓存为 _t 可以避免每帧重复查找组件；第四项则是把 Y 设为绝对值 1，不是相对移动。",
  "tags": [
   "Transform",
   "世界坐标",
   "局部坐标",
   "缓存引用"
  ]
 },
 {
  "id": "engine-07",
  "cat": "engine",
  "level": "基础",
  "type": "judge",
  "q": "运行时销毁场景中的 GameObject 应优先使用 DestroyImmediate，因为它会立即释放对象，能避免一帧的延迟。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Destroy 会把对象标记为待销毁，在当前帧结束时统一销毁并触发 OnDestroy，这种延迟让同一帧内其他逻辑仍能安全访问对象，也避免在遍历集合时破坏迭代。DestroyImmediate 会立刻销毁，容易让仍在引用的代码拿到失效对象，还可能误删资产，通常只用于编辑器工具。运行时需要立刻“消失”可以先 SetActive(false)，真正释放仍交给 Destroy。",
  "tags": [
   "Destroy",
   "DestroyImmediate",
   "对象销毁"
  ]
 },
 {
  "id": "engine-08",
  "cat": "engine",
  "level": "进阶",
  "type": "single",
  "q": "关于 Instantiate 与 Destroy 的调用时机，哪项正确？",
  "options": [
   "Instantiate 同步完成并返回对象，激活对象上的 Awake/OnEnable 已在返回前执行；Destroy 延迟到当前帧末，真正销毁前对象仍可能被引用。",
   "Instantiate 总是延迟到下一帧创建，Awake 也在下一帧执行。",
   "Destroy 会立即触发 OnDestroy，因此可以紧接着访问已销毁对象。",
   "DestroyImmediate 适合在运行时遍历列表时安全删除元素。"
  ],
  "answer": [
   0
  ],
  "explain": "Instantiate 是同步调用，复制并激活对象时 Awake 和 OnEnable 会立即执行，Start 则等到下一次该对象启用后的第一帧 Update 前。Destroy 只是登记销毁，实际销毁发生在当前帧末，OnDestroy 也在那时调用；在销毁前对象仍可能被其他引用访问。DestroyImmediate 立即生效，反而更容易破坏正在进行的遍历和引用，不适合作为运行时默认选择。",
  "tags": [
   "Instantiate",
   "Destroy",
   "对象生命周期"
  ]
 },
 {
  "id": "engine-09",
  "cat": "engine",
  "level": "进阶",
  "type": "multi",
  "q": "关于场景加载与 DontDestroyOnLoad，哪些说法正确？",
  "options": [
   "SceneManager.LoadScene 同步加载并阻塞当前帧；LoadSceneAsync 返回 AsyncOperation，可用 allowSceneActivation 控制何时切换，progress 在其为 false 时通常最多到 0.9。",
   "DontDestroyOnLoad 只对根 GameObject 生效；根对象及其子对象会跨场景保留，但重复进入原场景会再创建一个，需要自行去重。",
   "DontDestroyOnLoad 只在播放模式下有意义；在编辑器中调用不会让对象在退出播放模式后继续留在编辑场景。",
   "用 LoadSceneMode.Additive 加载的场景不会被算作已加载场景，必须调用 SetActiveScene 后才开始运行。"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "同步加载会阻塞主线程，异步加载则通过 AsyncOperation 分帧推进；allowSceneActivation 为 false 时加载进度停在约 0.9，直到允许激活。DontDestroyOnLoad 只作用于根对象，子对象随根保留；重复加载原场景会产生重复的常驻对象，常见做法是单例去重。Additive 场景加载完成后就会运行，SetActiveScene 影响的是新实例归属和光照等设置，并不是场景开始运行的前提。",
  "tags": [
   "SceneManager",
   "LoadSceneAsync",
   "DontDestroyOnLoad",
   "多场景"
  ]
 },
 {
  "id": "engine-10",
  "cat": "engine",
  "level": "进阶",
  "type": "single",
  "q": "用 LoadSceneMode.Additive 加载了 Level 场景，希望之后 Instantiate 的敌人归属该场景，以便 UnloadSceneAsync 时一并清理。最合适的做法是？",
  "options": [
   "加载后调用 SceneManager.SetActiveScene(levelScene)，再 Instantiate；也可用 SceneManager.MoveGameObjectToScene 把根对象移入。",
   "直接 Instantiate，Unity 会按对象的世界坐标自动决定所属场景。",
   "对敌人调用 DontDestroyOnLoad，它就会跟随 Level 场景卸载。",
   "必须先把敌人预制体实例化到 Level 场景的 Inspector 中，运行时无法改变归属。"
  ],
  "answer": [
   0
  ],
  "explain": "运行时新实例化的对象默认进入当前 Active Scene，而不是按坐标或预制体来源归属；Additive 加载不会自动把新场景设为 Active。调用 SetActiveScene 后新对象会落入 Level，或者用 MoveGameObjectToScene 只移动根对象。卸载该 Additive 场景时，属于它的对象会被销毁；DontDestroyOnLoad 恰好相反，会让对象跨场景保留。",
  "tags": [
   "Additive Scene",
   "SetActiveScene",
   "MoveGameObjectToScene",
   "场景卸载"
  ]
 },
 {
  "id": "engine-11",
  "cat": "engine",
  "level": "进阶",
  "type": "single",
  "q": "关于 ExecuteInEditMode 与 ExecuteAlways，哪项正确？",
  "options": [
   "两者完全等价，只是 ExecuteAlways 是新名字。",
   "两者都能让脚本在编辑模式执行；ExecuteAlways 还会在 Prefab 资源上执行，ExecuteInEditMode 不会。",
   "ExecuteInEditMode 只在编辑器中生效，打包后脚本会被移除。",
   "它们只影响 OnGUI 是否在 Scene 视图绘制。"
  ],
  "answer": [
   1
  ],
  "explain": "两个特性都会让 MonoBehaviour 的 Awake、Update、OnEnable 等回调在非播放模式下运行，方便做编辑器预览，但它们在 Prefab 资源上的行为不同：ExecuteAlways 会作用于 Prefab 资源，ExecuteInEditMode 不会。编辑模式下运行的回调同样会修改场景或资产，因此常用 Application.isPlaying 区分状态，并把生成、保存等操作限制在明确时机。打包后脚本仍然存在，不会因为该特性被移除。",
  "tags": [
   "ExecuteInEditMode",
   "ExecuteAlways",
   "编辑器脚本"
  ]
 },
 {
  "id": "engine-12",
  "cat": "engine",
  "level": "进阶",
  "type": "judge",
  "q": "OnApplicationQuit 在所有平台都能保证被调用，包括移动端被系统强杀或崩溃退出，因此适合在其中保存关键进度。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "OnApplicationQuit 主要在桌面端退出、编辑器停止播放等正常退出路径中调用；移动端应用可能被系统直接杀死或因崩溃退出，此时没有机会执行它。移动端更可靠的做法是在 OnApplicationPause(true) / OnApplicationFocus(false) 时及时落盘，并采用增量保存或事务式写入，避免只依赖退出回调。即使回调被调用，也应考虑写文件耗时和平台对后台执行的限制。",
  "tags": [
   "Application",
   "OnApplicationQuit",
   "OnApplicationPause",
   "数据保存"
  ]
 },
 {
  "id": "engine-13",
  "cat": "engine",
  "level": "进阶",
  "type": "single",
  "q": "Unity 协程的底层实现，哪项描述正确？",
  "options": [
   "协程运行在独立线程，yield 会让该线程休眠。",
   "C# 编译器把含 yield 的迭代器方法编译成状态机，Unity 在 PlayerLoop 的协程更新阶段调用 MoveNext，根据 yield return 的对象决定何时恢复。",
   "协程基于 Task，默认在线程池执行，因此可以安全地做阻塞 IO。",
   "协程由 Update 通过反射逐帧调用协程方法。"
  ],
  "answer": [
   1
  ],
  "explain": "协程方法返回 IEnumerator，C# 编译器会生成一个状态机类，把局部变量和当前执行位置保存在字段中；Unity 每帧驱动 MoveNext，并根据 yield return 的对象判断恢复条件。它没有创建新线程，协程里的阻塞调用、死循环或大量计算仍然会卡住主线程。WaitForSeconds、WaitForEndOfFrame 等指令只是让 Unity 在合适的时机再次推进该状态机。",
  "tags": [
   "协程",
   "迭代器",
   "状态机",
   "PlayerLoop"
  ]
 },
 {
  "id": "engine-14",
  "cat": "engine",
  "level": "进阶",
  "type": "single",
  "q": "假设协程启动时 Time.time 约为 0，随后 timeScale 一直保持 0.5。两次日志输出的 Time.time 分别约为多少？",
  "code": "IEnumerator Demo()\n{\n    Time.timeScale = 0.5f;\n    yield return new WaitForSeconds(1f);\n    Debug.Log(Time.time);\n    yield return new WaitForSecondsRealtime(1f);\n    Debug.Log(Time.time);\n}",
  "options": [
   "第一次约 0.5，第二次约 1.0",
   "第一次约 1.0，第二次约 1.5",
   "第一次约 2.0，第二次约 2.5",
   "两次都约 1.0"
  ],
  "answer": [
   1
  ],
  "explain": "WaitForSeconds 使用受 timeScale 缩放的时间，timeScale 为 0.5 时等待 1 个“游戏秒”需要约 2 个真实秒，期间 Time.time 只增加约 1。之后 WaitForSecondsRealtime 使用真实时间，等 1 个真实秒期间 Time.time 再增加约 0.5，所以第二次日志约为 1.5。若 timeScale 为 0，WaitForSeconds 会一直等待，而 WaitForSecondsRealtime 仍会结束。",
  "tags": [
   "WaitForSeconds",
   "WaitForSecondsRealtime",
   "Time.timeScale"
  ]
 },
 {
  "id": "engine-15",
  "cat": "engine",
  "level": "进阶",
  "type": "multi",
  "q": "关于协程的停止与生命周期，哪些说法正确？",
  "options": [
   "把 MonoBehaviour.enabled 设为 false 会立即停止该组件启动的所有协程。",
   "把所在 GameObject.SetActive(false) 会停止其上的协程；重新激活后不会从原来的 yield 位置自动恢复。",
   "Destroy(gameObject) 会终止协程；在 OnDestroy 里再启动协程做延时清理不可靠。",
   "StopCoroutine(Coroutine) 能精确停止对应句柄；StopCoroutine(string) 按方法名停止，同名多个时容易停错，且字符串调用有额外开销。"
  ],
  "answer": [
   1,
   2,
   3
  ],
  "explain": "禁用 MonoBehaviour 组件只会停掉它的 Update 等回调，已经启动的协程通常仍会继续运行，这是很常见的误区。禁用整个 GameObject 会停止其上的协程，重新启用也不会恢复；销毁对象同样会终止协程，因此在 OnDestroy 中再启动延时协程没有意义。保存 StartCoroutine 返回的 Coroutine 句柄再传给 StopCoroutine 最可靠，按字符串停止同名协程时只作用于其中一个，容易误停。",
  "tags": [
   "协程",
   "StopCoroutine",
   "OnDisable",
   "对象销毁"
  ]
 },
 {
  "id": "engine-16",
  "cat": "engine",
  "level": "进阶",
  "type": "single",
  "q": "在 Project Settings > Script Execution Order 中把脚本 A 设为 -100，脚本 B 保持默认 0。以下哪项一定成立？",
  "options": [
   "A 的 Start 一定早于 B 的 Awake。",
   "同一帧内同类事件（如 Awake、Update）A 先于 B；但不会改变单个脚本内部 Awake → OnEnable → Start 的顺序，也不保证不同类事件之间的跨阶段顺序。",
   "只有 Update 受该设置影响，Awake 和 FixedUpdate 不受影响。",
   "A 中启动的协程一定先于 B 中启动的协程恢复。"
  ],
  "answer": [
   1
  ],
  "explain": "Script Execution Order 调整的是各 MonoBehaviour 事件函数之间的相对顺序，配置为 -100 的 A 在同一类事件上会排到 B 前面。它不会打破 Unity 自身的生命周期阶段，也不会让 A.Start 跨到 B.Awake 之前，更不能保证协程恢复顺序。依赖初始化先后时，应显式调用初始化方法或使用事件/管理器，而不是只靠顺序设置。",
  "tags": [
   "Script Execution Order",
   "脚本顺序",
   "生命周期"
  ]
 },
 {
  "id": "engine-17",
  "cat": "engine",
  "level": "高级",
  "type": "multi",
  "q": "关于 Prefab、嵌套 Prefab 与 Prefab Variant，哪些说法正确？",
  "options": [
   "嵌套 Prefab 的源资产应在 Prefab Mode 中编辑；场景实例上的修改会记录为 override，可以 Apply 回源 Prefab 或 Revert。",
   "Prefab Variant 以另一个 Prefab 为基础，可覆盖属性、增删组件；基础 Prefab 的结构变化会传播到 Variant。",
   "在场景中修改嵌套 Prefab 的子对象时，override 记录在最外层实例上，可通过 Open Prefab 进入对应层级继续编辑。",
   "对实例执行 Unpack Prefab Completely 后，它仍与源 Prefab 保持链接，后续源 Prefab 的修改会继续同步。"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Prefab 实例与源资产通过 override 机制关联，属性、组件和子对象的改动可以 Apply 或 Revert，嵌套层级则通过 Prefab Mode 进入编辑。Prefab Variant 继承基础 Prefab，只记录差异，因此基础结构变化会传播，除非被 Variant 覆盖。Unpack Prefab Completely 会把嵌套层级也展开，并切断实例与源 Prefab 的链接，之后的修改不再同步。",
  "tags": [
   "Prefab",
   "嵌套 Prefab",
   "Prefab Variant",
   "Override"
  ]
 },
 {
  "id": "engine-18",
  "cat": "engine",
  "level": "高级",
  "type": "single",
  "q": "需要在每帧更新中获取场景内所有敌人并遍历，以下哪种方案最合适？",
  "options": [
   "每帧调用 GameObject.Find(\"Enemy\")。",
   "每帧调用 GameObject.FindGameObjectsWithTag(\"Enemy\") 并遍历返回数组。",
   "启动时用 FindObjectsOfType<Enemy>() 或由生成器注册收集一次，之后维护增删列表，Update 只遍历缓存。",
   "在 Update 中对每个敌人调用 transform.Find 递归搜索。"
  ],
  "answer": [
   2
  ],
  "explain": "Find 系列 API 需要遍历场景层级或按标签扫描，FindGameObjectsWithTag 每次还会分配新数组，放在 Update 中会把开销随对象数量放大。更合适的做法是在初始化或生成/销毁时维护一份注册表，Update 只遍历缓存；对象池可以进一步避免频繁创建销毁。注意 FindObjectsOfType 默认找不到未激活对象，缓存列表也要同步处理禁用和销毁。",
  "tags": [
   "Find",
   "性能优化",
   "对象管理"
  ]
 },
 {
  "id": "engine-19",
  "cat": "engine",
  "level": "高级",
  "type": "judge",
  "q": "可以通过 UnityEngine.LowLevel.PlayerLoop 获取当前 PlayerLoopSystem，插入或替换自定义系统来调整更新顺序；这不需要修改引擎源码，但自定义系统仍在主线程执行，异常和执行频率要自行处理。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "PlayerLoop.GetCurrentPlayerLoop 可以取得当前循环结构，配合 PlayerLoopSystem 和 SetPlayerLoop 能插入、移除或替换子系统，常用于自定义更新阶段或把一批逻辑集中调度。它运行在 Unity 主循环的主线程上，不会自动变成并行任务，耗时逻辑依然会造成卡顿。自定义系统需要自己处理异常、启用状态和频率，并注意编辑器域重载后要重新注册。",
  "tags": [
   "PlayerLoop",
   "更新顺序",
   "主线程"
  ]
 },
 {
  "id": "engine-20",
  "cat": "engine",
  "level": "高级",
  "type": "single",
  "q": "代码希望每 60 个渲染帧生成一次敌人，并设置了 targetFrameRate 与 vSync。以下判断哪项正确？",
  "code": "void Awake()\n{\n    Application.targetFrameRate = 60;\n    QualitySettings.vSyncCount = 1;\n}\n\nvoid Update()\n{\n    if (Time.frameCount % 60 == 0)\n        SpawnEnemy();\n}",
  "options": [
   "vSync 开启时 targetFrameRate 仍会强制精确 60 FPS，所以 60 帧一定等于 1 秒。",
   "Time.frameCount 是渲染帧计数；targetFrameRate 只是目标值，受 vSync、性能和平台限制，60 帧不保证 1 秒，周期逻辑应基于累计时间。",
   "Time.frameCount 每个 FixedUpdate 递增一次，因此这段代码与物理帧同步。",
   "targetFrameRate 只影响编辑器，打包后无效。"
  ],
  "answer": [
   1
  ],
  "explain": "Time.frameCount 统计的是已经渲染的帧数，不是物理步数；帧率会受 vSync、设备性能、平台策略和编辑器开销影响，targetFrameRate 只是期望值而非硬保证。vSyncCount 大于 0 时帧率会被垂直同步约束，targetFrameRate 无法确保精确的 60 FPS。需要按时间周期生成时，应累计 Time.deltaTime 或使用计时器，而不是用 frameCount 取模。",
  "tags": [
   "Time.frameCount",
   "targetFrameRate",
   "vSync",
   "帧率"
  ]
 },
 {
  "id": "engine-21",
  "cat": "engine",
  "level": "高级",
  "type": "multi",
  "q": "关于 Update、LateUpdate 与协程的调度，哪些说法正确？",
  "options": [
   "同一帧内通常先执行所有 Update，再执行所有 LateUpdate；yield return null 的协程一般在 Update 之后、LateUpdate 之前恢复。",
   "StartCoroutine 会先同步执行协程体，直到遇到第一个 yield 才返回。",
   "WaitForEndOfFrame 在渲染和 GUI 绘制之后恢复，常用于截图；它不依赖 timeScale。",
   "协程恢复顺序由 Script Execution Order 精确控制，先启动的协程一定先恢复。"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Unity 的主循环顺序中，Update 全部执行完后才进入 LateUpdate；yield return null 的协程通常在 Update 之后、LateUpdate 之前集中恢复。StartCoroutine 不是把整个方法排队到下一帧，而是立即同步执行到第一个 yield，因此启动前的初始化代码会当场运行。WaitForEndOfFrame 等的是帧末渲染与 GUI 完成，不按缩放时间计时；Script Execution Order 只配置事件函数，不能精确决定协程恢复顺序。",
  "tags": [
   "Update",
   "LateUpdate",
   "协程",
   "WaitForEndOfFrame"
  ]
 },
 {
  "id": "engine-22",
  "cat": "engine",
  "level": "高级",
  "type": "judge",
  "q": "下一帧执行下面的检查时，第一行输出 True、第二行输出 False；这说明 Unity 的 UnityEngine.Object 重载了 ==，已销毁对象会被当作 null，但直接访问 go.name 仍可能抛 MissingReferenceException。",
  "code": "public GameObject go; // 已在上一帧被 Destroy\n\nIEnumerator CheckNextFrame()\n{\n    yield return null;\n    Debug.Log(go == null);         // True\n    Debug.Log((object)go == null); // False\n}",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "UnityEngine.Object 重载了 == 和 !=，会比较底层原生对象是否仍然存在；对象被销毁后，C# 包装引用还在，但运算符会返回“等于 null”。把引用转成 object 或使用 ReferenceEquals 会绕过重载，因此第二行是 False。空条件运算符 ?. 和模式匹配 is null 也可能绕过该重载，访问已销毁对象的成员会抛 MissingReferenceException，所以 Unity 对象判空应明确使用 == null。",
  "tags": [
   "伪空",
   "UnityEngine.Object",
   "Destroy",
   "空引用"
  ]
 },
 {
  "id": "physics-01",
  "cat": "physics",
  "level": "基础",
  "type": "single",
  "q": "关于 Collision 回调与 Trigger 回调的区别，哪项正确？",
  "options": [
   "Collision 回调会给出接触点、法线并产生物理阻挡；Trigger 回调不产生物理阻挡，也没有接触点，通常只传对方 Collider。",
   "Trigger 回调也会给出接触点，只是不会产生力。",
   "只要两个 Collider 都存在，即使都没有 Rigidbody，也会触发 OnCollisionEnter。",
   "OnTriggerEnter 在 Trigger 体积内每帧都会调用。"
  ],
  "answer": [
   0
  ],
  "explain": "Collision 回调发生在实体碰撞中，Collision 参数包含 contacts、relativeVelocity 等信息，物体会被阻挡并产生碰撞响应。Trigger 只是把 Collider 的 isTrigger 打开，用于范围检测，不会阻挡物体，也没有接触点；进入、停留、离开分别对应 OnTriggerEnter、OnTriggerStay、OnTriggerExit。物理碰撞和 Trigger 事件通常都要求至少一方带 Rigidbody，两个纯静态 Collider 不会产生这些回调。",
  "tags": [
   "Collision",
   "Trigger",
   "OnTriggerEnter",
   "碰撞回调"
  ]
 },
 {
  "id": "physics-02",
  "cat": "physics",
  "level": "基础",
  "type": "single",
  "q": "关于 Rigidbody 的 Dynamic、Kinematic 与 Static 三种状态，哪项正确？",
  "options": [
   "Dynamic 受重力和力驱动；Kinematic 不受力但可用 MovePosition/MoveRotation 移动并推开 Dynamic；Static 是未挂 Rigidbody 的静态碰撞体，不应随意移动。",
   "Kinematic 也会受重力，只是不会被玩家推动。",
   "Static 就是 isKinematic = true 的 Rigidbody，适合做移动平台。",
   "Dynamic 只能用 transform.position 移动，AddForce 不会生效。"
  ],
  "answer": [
   0
  ],
  "explain": "Dynamic 刚体参与完整物理积分，受重力、力和碰撞冲量影响；Kinematic 刚体不受重力和力，但通过 MovePosition/MoveRotation 移动时仍能与 Dynamic 刚体产生碰撞并传递动量。Static 指没有 Rigidbody 的 Collider（或标记为 Static 的场景几何），适合地面和墙，不应频繁移动。移动平台应使用 Kinematic Rigidbody，直接移动静态碰撞体会带来昂贵的物理重建和不可靠的接触。",
  "tags": [
   "Rigidbody",
   "Dynamic",
   "Kinematic",
   "Static"
  ]
 },
 {
  "id": "physics-03",
  "cat": "physics",
  "level": "基础",
  "type": "judge",
  "q": "物理模拟和相关回调按固定时间步长推进；当渲染帧率高于物理步长时，一个渲染帧内可能执行 0 次或多次 FixedUpdate。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "FixedUpdate 由物理时间累积驱动，默认 Time.fixedDeltaTime 为 0.02 秒，即约 50 次/秒，与渲染帧率解耦。渲染帧很快时，一个渲染帧内可能没有物理步；渲染帧很慢时，Unity 会补跑多个物理步，但补跑次数受 Time.maximumDeltaTime 限制。碰撞检测和 OnCollisionEnter 等物理回调也发生在物理更新阶段，因此适合把刚体运动放在 FixedUpdate 中处理。",
  "tags": [
   "FixedUpdate",
   "fixedDeltaTime",
   "物理步长"
  ]
 },
 {
  "id": "physics-04",
  "cat": "physics",
  "level": "基础",
  "type": "single",
  "q": "为角色选择 CapsuleCollider 而不是 MeshCollider，最主要的原因是？",
  "options": [
   "Capsule 的碰撞计算更便宜，在台阶和斜面边缘也更稳定；非凸 MeshCollider 不能用于非 Kinematic 的 Rigidbody，凸网格同样更贵。",
   "Capsule 会自动贴合角色网格的每个凹凸。",
   "MeshCollider 不能设置为 Trigger。",
   "Capsule 一定比 BoxCollider 精确。"
  ],
  "answer": [
   0
  ],
  "explain": "原始碰撞体（Box、Sphere、Capsule）用解析形状做检测，开销低且接触稳定；Capsule 的圆滑侧面还能减少角色卡在台阶或墙缝的情况。MeshCollider 依赖网格三角形，凸网格可用于 Dynamic 刚体但成本更高，非凸网格只能用于静态或 Kinematic 碰撞体。因此角色通常用 Capsule 近似，复杂外形再用子碰撞体组合，而不是直接用高面数网格。",
  "tags": [
   "CapsuleCollider",
   "MeshCollider",
   "Collider 性能"
  ]
 },
 {
  "id": "physics-05",
  "cat": "physics",
  "level": "基础",
  "type": "single",
  "q": "一个球从斜面滚下，希望减少弹跳并增加滚动阻力，应优先调整哪组属性？",
  "options": [
   "提高 Physic Material 的 Dynamic Friction、降低 Bounciness，并检查 Friction Combine 与 Bounce Combine。",
   "提高 Bounciness，降低 Static Friction。",
   "把 Rigidbody.mass 设为 0。",
   "把球的 Collider 的 isTrigger 设为 true。"
  ],
  "answer": [
   0
  ],
  "explain": "Physic Material 的 Bounciness 控制弹性，Dynamic Friction 控制已经滑动时的阻力，Static Friction 决定从静止开始运动所需的力。降低 Bounciness 能减少反弹，提高 Dynamic Friction 会增加接触面的滑动阻力，Combine 模式则决定两个材质接触时如何合成参数。mass 为 0 不是正常的无弹跳设置，Trigger 则会完全关闭物理碰撞响应。若要衰减球体的滚动，还应调整 Rigidbody.angularDrag。",
  "tags": [
   "Physic Material",
   "摩擦力",
   "Bounciness",
   "Friction Combine"
  ]
 },
 {
  "id": "physics-06",
  "cat": "physics",
  "level": "进阶",
  "type": "single",
  "q": "高速子弹连续穿过薄墙，最合理的修复方案是？",
  "options": [
   "把子弹 Rigidbody.collisionDetectionMode 设为 ContinuousDynamic，并让墙使用静态 Collider；必要时再用 Raycast 做命中预判。",
   "把 Time.fixedDeltaTime 调大，让每个物理步覆盖更长的距离。",
   "把子弹设为 Kinematic，并每帧直接修改 transform.position。",
   "把墙的 Collider 设为 Trigger，这样就不会穿透。"
  ],
  "answer": [
   0
  ],
  "explain": "Discrete 只在每个物理步采样刚体位置，子弹在一个步长内从墙的一侧跳到另一侧时就会漏检。Continuous 主要针对静态碰撞体，ContinuousDynamic 能对静态和动态碰撞体做连续检测，适合高速子弹；Speculative 更便宜，但精度和适用场景不同。调大 fixedDeltaTime 会让单步位移更大，Kinematic 直接改 transform 或把墙设为 Trigger 都不会产生可靠的阻挡。",
  "tags": [
   "Collision Detection",
   "ContinuousDynamic",
   "穿透",
   "CCD"
  ]
 },
 {
  "id": "physics-07",
  "cat": "physics",
  "level": "进阶",
  "type": "multi",
  "q": "关于物理查询与 LayerMask，哪些说法正确？",
  "options": [
   "Physics.Raycast 返回 bool 并只给出最近命中；RaycastAll 返回所有命中，但数组顺序不保证按距离排序。",
   "LayerMask 参数应传层索引，所以直接传 LayerMask.NameToLayer(\"Enemy\") 即可。",
   "SphereCast 适合有体积的扫掠检测（如角色胶囊），OverlapSphere 适合无方向的范围内查询。",
   "LayerMask 应传位掩码，如 1 << LayerMask.NameToLayer(\"Enemy\")；Physics.Raycast 的 maxDistance 默认是 Infinity。"
  ],
  "answer": [
   0,
   2,
   3
  ],
  "explain": "Raycast 只关心最近的一个命中，RaycastAll 会返回所有命中但顺序没有保证，需要按 distance 自行排序。LayerMask 是位掩码，NameToLayer 返回的是层索引，直接传索引通常会得到错误的层组合，应该用 1 << layer 或 LayerMask.GetMask。SphereCast 沿射线扫掠一个球体，适合角色这类有体积的检测；OverlapSphere 不做方向投射，直接查询球范围内的 Collider。",
  "tags": [
   "Raycast",
   "SphereCast",
   "OverlapSphere",
   "LayerMask"
  ]
 },
 {
  "id": "physics-08",
  "cat": "physics",
  "level": "进阶",
  "type": "single",
  "q": "项目全局 Physics.queriesHitTriggers 为 true，现在希望某一次 Raycast 忽略 Trigger，而其他查询保持原行为。应该怎么做？",
  "options": [
   "给该次调用传入 QueryTriggerInteraction.Ignore。",
   "给该次调用传入 QueryTriggerInteraction.UseGlobal。",
   "查询前把全局 Physics.queriesHitTriggers 设为 false，查询后恢复。",
   "改用 RaycastAll，它会自动忽略 Trigger。"
  ],
  "answer": [
   0
  ],
  "explain": "QueryTriggerInteraction 提供逐次查询的覆盖：Ignore 强制忽略 Trigger，Collide 强制命中 Trigger，UseGlobal 则沿用 Physics.queriesHitTriggers。给单次 Raycast 传 Ignore 不会影响其他查询，也不会产生全局状态恢复遗漏的问题。临时改全局开关容易影响同一帧内的其他系统，而 RaycastAll 默认并不会自动忽略 Trigger。",
  "tags": [
   "QueryTriggerInteraction",
   "Raycast",
   "Trigger"
  ]
 },
 {
  "id": "physics-09",
  "cat": "physics",
  "level": "进阶",
  "type": "single",
  "q": "每帧进行大量射线检测时，使用 RaycastNonAlloc 的主要收益和注意点是什么？",
  "options": [
   "复用调用方预分配的数组，避免每次查询分配结果数组；返回的是实际命中数，容量不足会截断，需要按返回值遍历。",
   "它保证返回全部命中，不受数组长度限制。",
   "它把查询放到后台线程，所以没有主线程开销。",
   "它只适用于 Trigger 查询。"
  ],
  "answer": [
   0
  ],
  "explain": "RaycastAll 每次都会创建并返回一个新数组，高频调用会持续产生 GC 压力；RaycastNonAlloc 把结果写入传入的缓冲区并返回命中数量，从而复用内存。缓冲区容量不足时只会保留一部分结果，因此要按返回的 count 遍历，并根据业务上限选择足够大的数组。它仍然在主线程同步执行，只是减少了分配；更极端的批量查询可以考虑 RaycastCommand 配合 Job System。",
  "tags": [
   "RaycastNonAlloc",
   "GC",
   "物理查询",
   "性能优化"
  ]
 },
 {
  "id": "physics-10",
  "cat": "physics",
  "level": "进阶",
  "type": "single",
  "q": "关于 CharacterController 与 Rigidbody 角色控制，哪项正确？",
  "options": [
   "CharacterController 通过胶囊扫掠处理移动、台阶和斜坡，不受 AddForce 或重力自动驱动；需要自己施加重力，也不会自动被 Rigidbody 推动。",
   "CharacterController 是 Rigidbody 的子类，所以会自动受重力。",
   "CharacterController 可以用 AddForce 移动，并自动产生 OnCollisionEnter。",
   "CharacterController 不需要任何 Collider，因此不会与场景碰撞。"
  ],
  "answer": [
   0
  ],
  "explain": "CharacterController 是独立的角色移动组件，内部用胶囊形状做扫掠检测，提供 Move、isGrounded、slopeLimit、stepOffset 等能力，但不是 Rigidbody，也不走完整的物理积分。它不会自动受重力，需要在移动向量中自行累加重力；与 Rigidbody 碰撞时也不会像刚体那样被推开，只能通过 OnControllerColliderHit 自行实现推动效果。它的碰撞信息来自控制器回调，而不是常规的 OnCollisionEnter。",
  "tags": [
   "CharacterController",
   "Rigidbody",
   "角色移动"
  ]
 },
 {
  "id": "physics-11",
  "cat": "physics",
  "level": "进阶",
  "type": "multi",
  "q": "关于 Unity 的 Joint（关节），哪些说法正确？",
  "options": [
   "HingeJoint 适合门、摆锤，可配置 limits 与 motor；ConfigurableJoint 能组合多个自由度，但配置复杂、开销更高。",
   "FixedJoint 保持两个刚体的相对位置和旋转，适合临时组合物体；可用 breakForce/breakTorque 或主动断开连接。",
   "Joint 所在对象必须有 Rigidbody；connectedBody 为空表示连接世界，非空时对方也必须有 Rigidbody。",
   "Joint 能替代 Collider 阻止穿透，所以被连接的物体不需要碰撞体。"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Joint 约束刚体的运动自由度，HingeJoint 提供铰链轴、限位和马达，FixedJoint 则把两个刚体临时锁在一起，超过 breakForce/breakTorque 会断开。ConfigurableJoint 可以组合平移和旋转约束，但参数多、求解成本也更高；简单关节通常更合适。Joint 只约束运动，不提供碰撞几何，物体仍需要 Collider 才能与场景或其他物体发生接触。",
  "tags": [
   "Joint",
   "HingeJoint",
   "FixedJoint",
   "ConfigurableJoint"
  ]
 },
 {
  "id": "physics-12",
  "cat": "physics",
  "level": "进阶",
  "type": "single",
  "q": "Player 层与 Enemy 层在 Layer Collision Matrix 中未勾选，但两者都有 Collider 和 Rigidbody。代码用 Physics.Raycast 并传入 Enemy 的 LayerMask。以下哪项正确？",
  "options": [
   "两者不会产生碰撞或 Trigger 回调；Raycast 仍可命中 Enemy，因为碰撞矩阵和查询 LayerMask 是两套过滤。",
   "碰撞和 Raycast 都会被碰撞矩阵屏蔽。",
   "只要一方是 Trigger，碰撞矩阵就会失效。",
   "碰撞矩阵只影响渲染层级，不影响物理。"
  ],
  "answer": [
   0
  ],
  "explain": "Layer Collision Matrix 决定两个层之间的碰撞和 Trigger 是否在物理模拟中生效，未勾选时双方不会产生接触或 Trigger 回调。物理查询使用调用时传入的 LayerMask 过滤，和碰撞矩阵相互独立，因此 Raycast 仍能命中 Enemy。若还要过滤 Trigger，需要另外使用 QueryTriggerInteraction；若只是屏蔽某两个具体碰撞体，则可用 Physics.IgnoreCollision。",
  "tags": [
   "Layer Collision Matrix",
   "LayerMask",
   "物理查询",
   "碰撞过滤"
  ]
 },
 {
  "id": "physics-13",
  "cat": "physics",
  "level": "高级",
  "type": "single",
  "q": "Rigidbody 在物理步之间出现渲染抖动，Interpolate 与 Extrapolate 的区别是什么？",
  "options": [
   "Interpolate 用上一物理帧和当前物理帧的姿态插值到当前渲染时刻，平滑但引入约一个物理步的视觉延迟；Extrapolate 按速度外推，延迟更低但可能过冲。",
   "Interpolate 预测未来，Extrapolate 回退过去。",
   "两者只提高物理模拟精度，不改变渲染姿态。",
   "开启后就可以不再使用 FixedUpdate。"
  ],
  "answer": [
   0
  ],
  "explain": "物理以固定步长运行，渲染帧率更高时刚体位置只在物理步更新，直接读取 Transform 会看到台阶式抖动。Interpolate 在两个已计算的物理姿态之间插值，画面更平滑，但显示位置会落后物理状态约一个物理步；Extrapolate 根据当前速度向未来外推，延迟更小，但急停或碰撞时可能出现过冲。它们只影响渲染姿态，不改变物理模拟结果，也不能替代 CCD 或 FixedUpdate。",
  "tags": [
   "Interpolation",
   "Extrapolation",
   "Rigidbody",
   "渲染抖动"
  ]
 },
 {
  "id": "physics-14",
  "cat": "physics",
  "level": "高级",
  "type": "judge",
  "q": "Rigidbody 休眠后会停止常规物理积分以节省 CPU；碰撞、AddForce 或速度变化会将其唤醒。sleepThreshold 是质量归一化能量阈值，调高会让刚体更容易进入休眠。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "休眠是刚体长时间低速运动后的优化状态，处于休眠的刚体不再进行常规积分，直到受到碰撞、力或速度变化等外部刺激。sleepThreshold 表示开始进入休眠的质量归一化能量阈值，调高意味着更容易达到休眠条件，调低则更晚休眠。可以用 IsSleeping 检查状态，用 WakeUp 主动唤醒；大量散落小物件开启休眠通常能明显降低物理开销。",
  "tags": [
   "Rigidbody",
   "休眠",
   "sleepThreshold",
   "性能优化"
  ]
 },
 {
  "id": "physics-15",
  "cat": "physics",
  "level": "高级",
  "type": "multi",
  "q": "在 OnCollisionEnter(Collision c) 中，关于参数信息和用法，哪些说法正确？",
  "options": [
   "c.contacts 提供接触点和法线，接触点数量取决于碰撞形状，不能假设只有一个。",
   "c.relativeVelocity 是碰撞时的相对线速度，可用于计算撞击强度或播放音效。",
   "c.collider 是对方 Collider，c.gameObject 是对方 GameObject；c.rigidbody 是对方 Rigidbody，可能为 null。",
   "c.contacts 中的法线方向固定从自身指向对方，与哪一方接收回调无关。"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "一次碰撞可能产生多个接触点，c.contacts 是 ContactPoint 数组，遍历时可用 point、normal、thisCollider/otherCollider 等信息。relativeVelocity 描述碰撞时的相对线速度，适合映射撞击音量、特效强度或伤害。c.collider 和 c.gameObject 指向对方，c.rigidbody 在对方没有 Rigidbody 时为 null，使用前要判空；接触法线的方向与接收回调的一方有关，不能当作固定的自身指向对方。",
  "tags": [
   "Collision",
   "ContactPoint",
   "relativeVelocity",
   "碰撞信息"
  ]
 },
 {
  "id": "physics-16",
  "cat": "physics",
  "level": "高级",
  "type": "judge",
  "q": "移动端物理优化中，应让静态场景物体使用静态碰撞体、用少量原始碰撞体组成 Compound Collider 代替高面数 MeshCollider，并减少同时激活的 Rigidbody；关闭 Auto Sync Transforms 后，修改 Transform 再立即做物理查询前要手动调用 Physics.SyncTransforms。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "静态场景物体不需要 Rigidbody，使用 Box、Sphere、Capsule 等原始碰撞体成本最低；复杂物件可以用多个子 Collider 组成 Compound Collider，由一个 Rigidbody 统一驱动，避免大量独立刚体。高面数 MeshCollider 的构建和碰撞查询都更贵，移动端应尽量用凸包或原始形状近似。关闭 Auto Sync Transforms 能减少 Transform 改动触发的隐式同步，但查询前若依赖最新 Transform，需要显式调用 Physics.SyncTransforms。",
  "tags": [
   "移动端优化",
   "Compound Collider",
   "Auto Sync Transforms",
   "静态碰撞体"
  ]
 },
 {
  "id": "render-01",
  "cat": "render",
  "level": "基础",
  "type": "single",
  "q": "团队要做一个移动端 3D 卡牌项目，要求移动端性能可接受、有官方长期维护、后续能接自定义后处理。下列关于渲染管线选择的说法，哪个最合适？",
  "options": [
   "选 Built-in，因为它 Shader 写法最简单，而且官方仍在持续为它加入新渲染特性",
   "选 URP，它是面向多平台的 SRP 管线，移动端有官方优化与支持，后处理通过 Volume 框架扩展",
   "选 HDRP，它向下兼容移动端，可以一套材质同时发布手机和 PC",
   "三条管线可以随意混用，只要在 Graphics Settings 里切换一下即可"
  ],
  "answer": [
   1
  ],
  "explain": "Built-in 已进入维护状态，新特性基本只进 SRP；HDRP 面向高端主机与 PC，不支持移动端，材质与 Shader 也不通用；切换管线不是改一个开关，材质、Shader、后处理、光照方案都要迁移，因此 A、C、D 都不对。URP 是移动端的主流选择，后处理用 Volume 加 Volume Profile 的 Override 来配。常见追问：URP 与 HDRP 的渲染路径差异、项目中途迁管线的成本、URP 的 Forward+ 有什么用。",
  "tags": [
   "URP",
   "HDRP",
   "渲染管线"
  ]
 },
 {
  "id": "render-02",
  "cat": "render",
  "level": "基础",
  "type": "single",
  "q": "一个物体从被提交渲染到出现在屏幕上，CPU 与 GPU 大致经历的阶段顺序是？",
  "options": [
   "应用阶段 → 几何阶段 → 光栅化阶段 → 逐片元处理",
   "几何阶段 → 应用阶段 → 逐片元处理 → 光栅化阶段",
   "应用阶段 → 光栅化阶段 → 几何阶段 → 逐片元处理",
   "应用阶段 → 逐片元处理 → 几何阶段 → 光栅化阶段"
  ],
  "answer": [
   0
  ],
  "explain": "应用阶段由 CPU 完成可见性裁剪、排序、设置渲染状态并输出 Draw Call；几何阶段在 GPU 上做顶点变换、投影、裁剪和屏幕映射；光栅化把图元转成片元；最后逐片元做纹理采样、光照计算和混合。其余选项都错在把光栅化提到几何阶段之前，或把逐片元处理放在了顶点处理之前。追问方向：哪个阶段更容易成为瓶颈、Early-Z 在这个流程里发生在哪一步。",
  "tags": [
   "渲染流程",
   "光栅化",
   "渲染管线"
  ]
 },
 {
  "id": "render-03",
  "cat": "render",
  "level": "基础",
  "type": "single",
  "q": "面试官问「Draw Call 到底是什么」，下面哪个回答最准确？",
  "options": [
   "就是一次 Mesh 的顶点数量统计",
   "CPU 通过图形 API 提交的一次绘制命令，包含设置渲染状态与发起绘制，真正的开销大头在提交前的状态校验与切换",
   "GPU 每帧实际执行的像素数量",
   "一个材质球对应一个 Draw Call，和 Mesh 数量无关"
  ],
  "answer": [
   1
  ],
  "explain": "Draw Call 是 CPU 侧的一次绘制提交，顶点数、像素数分别是几何成本与填充成本，不是 Draw Call 的定义。材质与 Mesh 也不是一一对应：合批会把多个 Mesh 合成一次提交，而一个材质若用了不同 Mesh 仍可能是多次提交。真正贵的是每次提交前后的状态切换与校验，所以 Draw Call 多时容易 CPU Bound，移动端尤其敏感。追问：合批、SRP Batcher、GPU Instancing 分别从哪个角度降低这部分成本。",
  "tags": [
   "Draw Call",
   "渲染状态",
   "CPU 开销"
  ]
 },
 {
  "id": "render-04",
  "cat": "render",
  "level": "基础",
  "type": "single",
  "q": "关于 Mipmap，下列说法正确的是？",
  "options": [
   "开启 Mipmap 会增加约三分之一的显存，但能减少远处纹理的采样闪烁并降低纹理带宽",
   "Mipmap 只对 UI 有用，3D 模型上开启会明显变糊，应该全部关掉",
   "Mipmap 等级由导入设置里的 Max Size 固定，与相机距离无关",
   "开启 Mipmap 可以减少 Draw Call"
  ],
  "answer": [
   0
  ],
  "explain": "Mipmap 生成一串逐级减半的纹理，显存约为原图的 4/3，即多出约 33%。当远处一个像素覆盖多个纹素时，GPU 采样更低级别，既能抑制闪烁（走样）也能减少纹理缓存缺失带来的带宽压力。它不改变 Draw Call，等级由 GPU 依据 UV 导数自动选择；UI 确实常关掉 Mipmap 省内存，但不能推广到所有 3D 场景。追问：各向异性过滤解决什么问题、Mipmap 与纹理流式加载的关系。",
  "tags": [
   "Mipmap",
   "纹理",
   "显存"
  ]
 },
 {
  "id": "render-05",
  "cat": "render",
  "level": "基础",
  "type": "single",
  "q": "同一套贴图要发布 Android（Adreno/Mali 为主）和 iOS，压缩格式的合理策略是？",
  "options": [
   "统一用 RGBA32，画质最好，包体大一点无所谓",
   "Android 用 ETC2 或 ASTC，iOS 用 ASTC 或 PVRTC，在导入设置里按平台分别配置压缩格式",
   "所有平台都用 PVRTC，因为它是通用格式",
   "压缩格式只影响包体大小，不影响运行时显存与采样带宽"
  ],
  "answer": [
   1
  ],
  "explain": "ASTC 是当前跨平台的主力格式，ETC2 是 Android/GLES3 的通用兜底，PVRTC 主要适用于 iOS 的 PowerVR 系 GPU，并非通用格式。按平台覆盖导入设置（Platform Override）是标准做法，可以兼顾兼容性与画质。RGBA32 是未压缩，运行时显存和带宽是压缩格式的数倍；压缩格式同时决定显存占用与采样效率，不只是包体。追问：ASTC 4x4 与 6x6 的取舍、压缩格式不支持时的回退策略。",
  "tags": [
   "ASTC",
   "ETC2",
   "纹理压缩"
  ]
 },
 {
  "id": "render-06",
  "cat": "render",
  "level": "基础",
  "type": "single",
  "q": "做第一人称射击时，希望手里的武器不穿墙、也不受主相机后处理影响，常见做法是？",
  "options": [
   "把武器放到主相机的近裁剪面之内",
   "给武器单独一个 Layer，主相机的 Culling Mask 排除该 Layer，再用一个 Depth 更高、Clear Flags 为 Depth Only 的武器相机只渲染该 Layer",
   "把武器 Shader 改成 ZTest Always，问题就解决了",
   "把武器 Mesh 的 Bounds 放大，让 Frustum Culling 裁不掉它"
  ],
  "answer": [
   1
  ],
  "explain": "独立 Layer 加独立相机（Clear Flags 设为 Depth Only、Depth 高于主相机）是标准的多层相机方案，可以单独控制武器的光照、深度关系和后处理叠加。ZTest Always 会让武器永远盖住一切、自身遮挡也错乱；放大 Bounds 只影响视锥剔除，与穿插无关；移进近裁剪面只会被裁掉。追问：两个相机都开后处理时如何避免武器被 Bloom 二次污染、武器相机要不要单独调 FOV。",
  "tags": [
   "Culling Mask",
   "多层相机",
   "Layer"
  ]
 },
 {
  "id": "render-07",
  "cat": "render",
  "level": "基础",
  "type": "judge",
  "q": "不透明物体按渲染队列从近到远绘制，透明物体按从远到近绘制，并且透明 Shader 通常要关闭 ZWrite。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "不透明物体开启 ZWrite，近处先画可以让后面被深度测试直接丢弃，对 Early-Z 友好；透明物体需要与背后已经画好的颜色做混合，必须从远到近画，并且一般不写深度，否则会挡住后面的透明物体。代价是透明物体之间只能靠 Queue 与排序，穿插时仍然会出错。追问：Alpha Test 与 Alpha Blend 在排序和 Early-Z 上的差别、如何用 Queue 手动控制渲染顺序。",
  "tags": [
   "渲染队列",
   "ZWrite",
   "透明排序"
  ]
 },
 {
  "id": "render-08",
  "cat": "render",
  "level": "进阶",
  "type": "multi",
  "q": "关于 Unity 的几种合批与实例化方式，下列说法正确的有？",
  "options": [
   "Static Batching 在构建时把静态物体的网格合并，用更大内存换取更少提交，合批后的物体不能再移动",
   "Dynamic Batching 有顶点数上限（约 300 顶点、900 顶点属性），超出的大网格会被放弃合批",
   "SRP Batcher 不减少 Draw Call 数量，而是减少每次提交之间的状态切换开销，要求同一 Shader 变体且材质属性布局一致",
   "GPU Instancing 只能用于完全相同的 Mesh 与 Material，不同实例的材质属性差异无法一次绘制"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "前三项分别对应静态合批的以内存换提交、动态合批的顶点上限、SRP Batcher 降状态切换而不降 DC 的本质。GPU Instancing 可以通过 MaterialPropertyBlock 或 instanced 属性传每实例数据，前提是 Shader 声明了对应属性并开启 GPU Instancing，所以 D 的绝对说法错误。另外 URP 下 Static Batching 依然可用，但它和 SRP Batcher 是两条不同的路径：静态合批后的网格往往不再享受逐材质 CBUFFER 复用，需要按项目实测选择。追问：为什么 SRP Batcher 与 GPU Instancing 的适用场景不同。",
  "tags": [
   "Static Batching",
   "SRP Batcher",
   "GPU Instancing"
  ]
 },
 {
  "id": "render-09",
  "cat": "render",
  "level": "进阶",
  "type": "single",
  "q": "打包后发现 Shader 变体数量过万，包体和首次加载时间明显变大，最有效的处理方式是？",
  "options": [
   "把不必要的 multi_compile 改成 shader_feature，并用 Shader Variant Collection 或 IPreprocessShaders 只保留实际用到的组合",
   "把 Shader 改写成 Surface Shader，变体会自动减少",
   "关闭 Project Settings 里的 Graphics Jobs",
   "把场景里的材质数量减少到 1 个"
  ],
  "answer": [
   0
  ],
  "explain": "multi_compile 会无条件编译所有关键字组合，shader_feature 只保留被材质引用的组合；再配合 Shader Variant Collection 记录运行时才会用到的组合，或者用 IPreprocessShaders 在构建时裁剪，是控制变体数量的标准手段。Surface Shader 只在 Built-in 生效且自身也会生成大量变体，URP 下根本不能用；Graphics Jobs 与变体无关；材质变少不等于关键字组合变少。追问：如何统计某个 Shader 的变体数量、变体在运行时缺失会表现成什么。",
  "tags": [
   "Shader 变体",
   "shader_feature",
   "Variant Collection"
  ]
 },
 {
  "id": "render-10",
  "cat": "render",
  "level": "进阶",
  "type": "judge",
  "q": "把 Built-in 项目迁移到 URP 时，原有的 Surface Shader 可以直接继续使用，URP 会在内部把它转换成 HLSL。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Surface Shader 是 Built-in 独有的代码生成机制，编译时会展开成多个 Pass 并接入内置光照函数，URP 没有这套生成流程。URP 的 Shader 必须手写顶点/片元，包含 URP 的 HLSL 库（Core.hlsl、Lighting.hlsl 等），并按 UniversalPipeline 的 SubShader 标签组织。迁移时通常重写为 URP 的 Lit/Unlit 或自定义 Pass，而不是指望自动转换。追问：URP 下怎么拿主光方向、阴影坐标和额外光。",
  "tags": [
   "Surface Shader",
   "URP",
   "Shader 迁移"
  ]
 },
 {
  "id": "render-11",
  "cat": "render",
  "level": "进阶",
  "type": "single",
  "q": "关于前向渲染与延迟渲染，下列说法正确的是？",
  "options": [
   "延迟渲染把几何信息写入 G-Buffer，光照在屏幕空间统一计算，适合大量实时光源，但透明物体仍要走前向",
   "延迟渲染在所有平台上都比前向快，移动端应优先选延迟",
   "前向渲染每个物体只计算一次光照，光源数量不会带来额外成本",
   "延迟渲染不支持阴影，所以只能用光照贴图替代"
  ],
  "answer": [
   0
  ],
  "explain": "延迟渲染先用 MRT 把 albedo、法线、深度等写进 G-Buffer，再对光源做屏幕空间的光照计算，光源数量增加时光照成本与场景几何复杂度解耦，代价是带宽大、对 MSAA 与透明不友好，透明物体只能退回前向。前向渲染的光照成本随受影响光源数线性增长，所以 C 错。移动端很多 GPU 带宽有限且不支持 MRT，因此 URP 默认前向，D 也与阴影实现无关。追问：URP 的 Forward+ 如何用分簇光照缓解前向的多光源成本。",
  "tags": [
   "前向渲染",
   "延迟渲染",
   "G-Buffer"
  ]
 },
 {
  "id": "render-12",
  "cat": "render",
  "level": "进阶",
  "type": "multi",
  "q": "一个开放世界场景由「静态建筑 + 大量动态角色 + 金属盔甲」组成，下列光照与反射方案搭配合理的有？",
  "options": [
   "静态建筑用 Baked Lightmap，运行时基本没有实时光照开销",
   "动态角色用 Light Probe 采样周围烘焙的间接光，让角色明暗与静态环境一致",
   "金属盔甲用局部 Reflection Probe（或平面反射）提供环境反射，而不是只依赖天空盒",
   "所有光源都设为 Realtime 并开启阴影，这样最真实，性能也最好"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Lightmap 烘焙静态几何的直接光与间接光；Light Probe 把烘焙光照信息插值到动态物体上，解决角色比环境偏亮或偏暗的问题；Reflection Probe 提供局部环境的 cubemap，金属高光才不会只反射天空。全实时加实时阴影在开放世界里成本极高，通常用 Baked/Mixed 混合，因此 D 错。追问：Mixed 模式下 Shadowmask 与 Distance Shadowmask 的区别、Light Probe 的插值体积与漏光问题。",
  "tags": [
   "Lightmap",
   "Light Probe",
   "Reflection Probe"
  ]
 },
 {
  "id": "render-13",
  "cat": "render",
  "level": "进阶",
  "type": "single",
  "q": "开放场景中远处角色的阴影出现明显锯齿，移动时还会闪烁，最直接有效的优化是？",
  "options": [
   "把 Shadow Distance 拉到覆盖整个场景",
   "使用级联阴影（Cascades），按距离分配分辨率，并配合调整 Shadow Distance 与 Bias/Normal Bias",
   "把阴影类型改成 Soft Shadows，锯齿就会消失",
   "关闭 Receive Shadows，只保留投射"
  ],
  "answer": [
   1
  ],
  "explain": "级联阴影把视锥按距离切成几段，近处用高分辨率、远处用低分辨率，在有限 Shadow Map 尺寸下兼顾近景质量与远处覆盖；Bias/Normal Bias 用来同时压掉自阴影 acne 和 peter-panning。把 Shadow Distance 拉满会让远处每米分到的纹素更少，反而更糟；Soft Shadows 只是滤波，不解决分辨率不足带来的锯齿与闪烁。追问：Cascade 数量增加带来的 Draw Call 与带宽代价、为什么移动远方物体时阴影会跳变。",
  "tags": [
   "Shadow Map",
   "级联阴影",
   "Bias"
  ]
 },
 {
  "id": "render-14",
  "cat": "render",
  "level": "进阶",
  "type": "single",
  "q": "在 URP 中给场景加 Bloom 并整体调色，正确的做法是？",
  "options": [
   "在相机上挂 Post Process Layer 组件，选择 Built-in 的 Post Process Profile",
   "在场景里放一个 Global Volume 并指定 Volume Profile，添加 Bloom 与 Color Adjustments/Tonemapping 的 Override，同时确认相机勾选了 Post Processing",
   "直接修改相机的 Background 颜色",
   "把 Bloom 写进自定义 Shader 的片元里，每帧对每个物体各做一遍"
  ],
  "answer": [
   1
  ],
  "explain": "URP 的后处理由 Volume 框架驱动：Global 或局部 Volume 加 Volume Profile，再给 Profile 添加 Override（Bloom、Tonemapping、Color Adjustments 等），相机上必须启用 Post Processing。Post Process Layer 是 Built-in 的 Post Processing Stack v2 组件，URP 下不适用；逐物体做全屏模糊既不现实也无法正确叠加。追问：Volume 的 Priority 与 Blend Distance 如何决定混合、移动端 Bloom 的降采样与带宽成本。",
  "tags": [
   "Volume",
   "Bloom",
   "Color Grading"
  ]
 },
 {
  "id": "render-15",
  "cat": "render",
  "level": "进阶",
  "type": "multi",
  "q": "下面是一段 URP 的 Unlit Shader 片段，关于它的结构，说法正确的有？",
  "code": "Shader \"Custom/URPUnlit\"\n{\n    Properties { _BaseMap (\"Base Map\", 2D) = \"white\" {} }\n    SubShader\n    {\n        Tags { \"RenderPipeline\" = \"UniversalPipeline\" }\n        Pass\n        {\n            HLSLPROGRAM\n            #pragma vertex vert\n            #pragma fragment frag\n            #include \"Packages/com.unity.render-pipelines.universal/ShaderLibrary/Core.hlsl\"\n\n            TEXTURE2D(_BaseMap); SAMPLER(sampler_BaseMap);\n            CBUFFER_START(UnityPerMaterial)\n                float4 _BaseMap_ST;\n            CBUFFER_END\n\n            struct Attributes { float4 positionOS : POSITION; float2 uv : TEXCOORD0; };\n            struct Varyings  { float4 positionHCS : SV_POSITION; float2 uv : TEXCOORD0; };\n\n            Varyings vert (Attributes IN)\n            {\n                Varyings OUT;\n                OUT.positionHCS = TransformObjectToHClip(IN.positionOS.xyz);\n                OUT.uv = TRANSFORM_TEX(IN.uv, _BaseMap);\n                return OUT;\n            }\n\n            half4 frag (Varyings IN) : SV_Target\n            {\n                return SAMPLE_TEXTURE2D(_BaseMap, sampler_BaseMap, IN.uv);\n            }\n            ENDHLSL\n        }\n    }\n}",
  "options": [
   "Tags 中的 RenderPipeline = UniversalPipeline 让这个 SubShader 只在 URP 下被使用",
   "CBUFFER_START(UnityPerMaterial) 里的属性会进逐材质常量缓冲，是 SRP Batcher 能合批的前提，布局必须与该 Shader 的所有 Pass 保持一致",
   "TransformObjectToHClip 把模型空间坐标变换到齐次裁剪空间，本质上就是 MVP 变换的封装",
   "URP 下必须使用 CGPROGRAM 而不是 HLSLPROGRAM，否则无法编译"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "URP 使用 HLSLPROGRAM 加 URP 的 HLSL 库，CGPROGRAM 是 Built-in 的写法，所以 D 正好说反了。RenderPipeline 标签用于管线过滤，避免 Shader 在错误管线里被使用；UnityPerMaterial 的 CBUFFER 是 SRP Batcher 的合批前提，同一 Shader 所有 Pass 的布局必须一致，否则会被判定为不兼容。TransformObjectToHClip 内部就是 UNITY_MATRIX_MVP 的封装。追问：为什么 Sampler 要单独声明、把纹理 ST 放进 CBUFFER 的原因。",
  "tags": [
   "URP Shader",
   "HLSL",
   "SRP Batcher"
  ]
 },
 {
  "id": "render-16",
  "cat": "render",
  "level": "进阶",
  "type": "single",
  "q": "手机上 UI 界面帧率偏低，Profiler 显示 GPU 时间高但 Draw Call 并不多，Frame Debugger 里同一片区域被反复绘制。最可能的原因是？",
  "options": [
   "Draw Call 太多，CPU 提交不过来",
   "Overdraw 过高：多层半透明 UI 与粒子重叠，同一像素被重复着色，填充率成为瓶颈",
   "纹理没有开 Mipmap",
   "没有开启 GPU Instancing"
  ],
  "answer": [
   1
  ],
  "explain": "Overdraw 指同一像素在一帧内被多次写入，半透明 UI、粒子、全屏后处理叠加时填充率开销会急剧上升，典型表现是 GPU 时间高而 Draw Call 数量正常。优化手段包括合并图集、裁掉透明区域、减少全屏 Blit、控制粒子层数与同屏数量。Mipmap 影响纹理带宽与远处闪烁，Instancing 影响提交次数，都不是填充率问题的主因，何况 Draw Call 已经不高。追问：如何在 Scene 视图的 Overdraw 模式下定位、UI 的 Canvas 重建与 Overdraw 的关系。",
  "tags": [
   "Overdraw",
   "填充率",
   "UI 性能"
  ]
 },
 {
  "id": "render-17",
  "cat": "render",
  "level": "进阶",
  "type": "judge",
  "q": "项目使用 Linear 色彩空间时，颜色纹理需要勾选 sRGB，而法线贴图、遮罩图、粗糙度等数据纹理应关闭 sRGB。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "颜色贴图存的是 sRGB 编码值，标记 sRGB 后 GPU 采样时会自动转到线性空间参与光照计算，最终输出再做一次编码；法线、粗糙度、遮罩是数据而不是颜色，若被当作 sRGB 转换会导致数值失真。Gamma 空间下不做这条转换，所以同一套贴图在两种空间下观感明显不同。追问：为什么切到 Linear 后 UI 颜色看起来变暗、HDR 与 Linear 是否必须一起开。",
  "tags": [
   "Linear",
   "Gamma",
   "sRGB"
  ]
 },
 {
  "id": "render-18",
  "cat": "render",
  "level": "高级",
  "type": "single",
  "q": "Profiler 中主线程脚本耗时 8ms、Gfx 等待 14ms、GPU 时间 16ms，帧率约 55 FPS。最合理的判断与优化方向是？",
  "options": [
   "CPU Bound，优先减少 Draw Call 与脚本开销",
   "GPU Bound，优先降低填充率、阴影、后处理和网格复杂度，同时确认是否被垂直同步或目标帧率限制",
   "内存不足导致，优先压缩纹理",
   "网络延迟导致，优先优化协议"
  ],
  "answer": [
   1
  ],
  "explain": "GPU 时间显著高于 CPU 且 Gfx 出现等待，说明 GPU 是瓶颈；此时继续砍 Draw Call 收益很小，应该用 Frame Debugger 定位是阴影、后处理还是 Overdraw 占了大头。55 FPS 也可能本身就是垂直同步或目标帧率限制的结果，要结合 Gfx.WaitForPresent 判断是真瓶颈还是被限帧。内存和网络问题不会直接表现为 GPU 时间长。追问：如何用 GPU Profiler 区分带宽瓶颈与 ALU 瓶颈、为什么要用 Development Build 取数据。",
  "tags": [
   "CPU Bound",
   "GPU Bound",
   "Profiler"
  ]
 },
 {
  "id": "render-19",
  "cat": "render",
  "level": "高级",
  "type": "single",
  "q": "用 Frame Debugger 排查「某个物体没有被 SRP Batcher 合批」，下列思路正确的是？",
  "options": [
   "Frame Debugger 只看得到 Draw Call 数量，无法判断批处理方式",
   "展开单个 Draw Call 查看其批次与 Batch Breaking 原因，常见原因是材质属性不在 UnityPerMaterial CBUFFER、使用了 MaterialPropertyBlock，或 Shader 未声明兼容 SRP Batcher",
   "只要 Shader 名字相同就一定会合批，没合批一定是引擎 Bug",
   "必须关闭 Frame Debugger 才能看到合批信息"
  ],
  "answer": [
   1
  ],
  "explain": "Frame Debugger 会显示每个 Draw Call 的批次原因，例如「SRP Batcher: Not compatible」「Objects have different materials」，是定位合批失败的第一手工具。SRP Batcher 要求同一 Shader 变体、CBUFFER 布局一致，而 MaterialPropertyBlock 会绕过逐材质 CBUFFER 直接导致不兼容。合批与 Shader 名字无关，只与变体和常量缓冲布局有关，所以 C 错。追问：为什么开着 Frame Debugger 时性能数据不能当基准、如何看一个 Draw Call 由哪些物体组成。",
  "tags": [
   "Frame Debugger",
   "SRP Batcher",
   "批处理"
  ]
 },
 {
  "id": "render-20",
  "cat": "render",
  "level": "高级",
  "type": "multi",
  "q": "下列哪些情况会导致 SRP Batcher 失效或无法合批？",
  "options": [
   "材质通过 MaterialPropertyBlock 修改属性",
   "材质属性没有放在 CBUFFER(UnityPerMaterial) 里，或同一 Shader 不同 Pass 的 CBUFFER 布局不一致",
   "两个物体使用的是不同 Shader 变体（例如关键字不同）",
   "物体使用了 GPU Instancing，因此必然与 SRP Batcher 互斥"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "SRP Batcher 的合批单位是「同一 Shader 变体 + 一致的 UnityPerMaterial CBUFFER 布局」：用 MaterialPropertyBlock 写属性会绕过逐材质 CBUFFER，CBUFFER 布局不一致或属性放在 CBUFFER 之外都会判定为不兼容，变体不同则 CBUFFER 结构根本不同。GPU Instancing 与 SRP Batcher 并非简单互斥，Unity 会按情况选择路径，所以 D 的绝对化说法错误。追问：URP 下 Static Batching 与 SRP Batcher 同时可用时如何取舍（静态合批后的网格常常失去逐材质 CBUFFER 复用，要按项目实测）。",
  "tags": [
   "SRP Batcher",
   "MaterialPropertyBlock",
   "Shader 变体"
  ]
 },
 {
  "id": "render-21",
  "cat": "render",
  "level": "高级",
  "type": "single",
  "q": "关于切线空间法线贴图，下列说法正确的是？",
  "options": [
   "法线贴图直接存世界空间法线，所以物体旋转后必须重新烘焙",
   "切线空间法线以顶点的 TBN 为基，贴图存的是相对表面法线的扰动，因此同一张图可复用到不同朝向的面，但要求模型有正确的切线与 UV",
   "法线贴图会真正改变模型轮廓，所以低模可以完全替代高模",
   "法线贴图的蓝色通道恒等于 1，可以安全丢弃"
  ],
  "answer": [
   1
  ],
  "explain": "切线空间法线把扰动编码在以切线、副切线、法线构成的坐标系里，只要 UV 和切线正确，同一张法线贴图就能贴到不同朝向的面上，这也是它比世界空间法线更常用的原因。它只改变着色时使用的法线，不改变几何轮廓，剪影仍然是低模，所以 C 错。蓝色通道存的是法线 Z 分量，只有在完全平坦处才接近 1，丢弃会丢失细节。追问：模型缺少切线时 Unity 如何处理、Mikktspace 与法线贴图的 Y 通道翻转。",
  "tags": [
   "法线贴图",
   "切线空间",
   "TBN"
  ]
 },
 {
  "id": "render-22",
  "cat": "render",
  "level": "高级",
  "type": "multi",
  "q": "大型场景要稳定 60 FPS，关于剔除与 LOD，下列做法合理的有？",
  "options": [
   "烘焙 Occlusion Culling 数据，让被墙挡住的对象不提交绘制，同时注意动态物体默认不参与遮挡剔除",
   "用 LOD Group 按屏幕占比切换网格，并配合 LOD Bias 与远处的 Cull 比例控制开销",
   "Frustum Culling 由相机视锥自动完成，但 Bounds 设得过大或过小都会让剔除结果不符合预期",
   "为了减少 Draw Call，把所有物体合并成一个 Mesh 并关闭剔除，这是最优解"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "遮挡剔除能整块跳过被遮挡物体，但依赖烘焙好的遮挡体与被遮挡体标记，动态物体默认不参与，需要额外处理；LOD Group 按屏幕相对高度切档，LOD Bias 可整体调节质量与开销；视锥剔除依赖 Renderer.bounds，Bounds 过大会导致该剔的没剔，过小则会在边缘突然消失。把整个场景合并成一个 Mesh 会让视锥与遮挡剔除完全失效、也无法做 LOD，通常得不偿失。追问：Occlusion Culling 数据在运行时如何加载、移动端内存与烘焙时间的代价。",
  "tags": [
   "Occlusion Culling",
   "LOD",
   "Frustum Culling"
  ]
 },
 {
  "id": "render-23",
  "cat": "render",
  "level": "高级",
  "type": "judge",
  "q": "开启 HDR 后相机颜色缓冲可以存超过 1 的亮度值，配合 Tonemapping 与曝光（EV）能把高亮区域压回可显示范围，因此 Bloom 的阈值通常设在 1 附近或更高。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "HDR 让高光保留超过 1 的亮度，Bloom 才能按阈值提取真正的高亮部分，最后由 Tonemapping 把宽动态范围映射回 0-1 输出；曝光（EV）整体缩放亮度，模拟相机或人眼的适应过程。若不开 HDR，超过 1 的部分在写入 LDR 缓冲时就被截断，Bloom 阈值调得再高也拿不到真实高光。追问：移动端 HDR 常用 R11G11B10 格式及其带宽代价、Tonemapping 的几种曲线差异。",
  "tags": [
   "HDR",
   "曝光",
   "Tonemapping"
  ]
 },
 {
  "id": "anim-01",
  "cat": "anim",
  "level": "基础",
  "type": "single",
  "q": "关于 Animator 与 Legacy Animation（Animation 组件）的区别，下列说法正确的是？",
  "options": [
   "Legacy Animation 同样支持 Animator Controller 的状态机与过渡",
   "Animator 基于 Mecanim 状态机，支持过渡、混合树、动画层与 Avatar；Legacy Animation 直接播放 AnimationClip，逻辑简单但没有状态机能力",
   "Animator 只能播放 Humanoid 动画，Generic 动画必须用 Legacy",
   "Legacy Animation 的性能一定比 Animator 差"
  ],
  "answer": [
   1
  ],
  "explain": "Animator 的核心是 Mecanim 的控制器、过渡、Blend Tree、Layer/Avatar Mask 和重定向能力；Legacy 只是 Animation.Play(clip) 的旧系统，没有状态机，但实现简单、开销可控。Animator 对 Humanoid 和 Generic 都支持，所以 C 错；在极简单场景下 Legacy 反而更轻，D 的「一定」不成立。追问：为什么新项目不再用 Legacy、两者混用会不会争夺同一骨骼。",
  "tags": [
   "Animator",
   "Legacy Animation",
   "Mecanim"
  ]
 },
 {
  "id": "anim-02",
  "cat": "anim",
  "level": "基础",
  "type": "single",
  "q": "一个「待机→跑步」的过渡关闭了 Has Exit Time，只设置一个条件 isRun = true，下列说法正确的是？",
  "options": [
   "必须等当前状态播放完才能切换",
   "条件满足后下一帧就会开始过渡，混合时长由 Transition Duration 控制",
   "Has Exit Time 只对 Any State 的过渡生效",
   "Bool 参数必须在代码里每帧 SetBool，设为 true 后不会保持"
  ],
  "answer": [
   1
  ],
  "explain": "Has Exit Time 关闭后过渡只由条件驱动，条件满足即开始混合，混合时长由 Transition Duration 与过渡曲线决定。Bool 是持续型参数，SetBool(true) 后会一直保持，直到被显式改回 false。Has Exit Time 对普通过渡同样有效，用于「播完再切」，并非 Any State 专属。追问：Interruption Source 与 Ordered Interruption 的作用、Any State 过渡为什么容易自杀式循环。",
  "tags": [
   "Animator",
   "状态机",
   "过渡"
  ]
 },
 {
  "id": "anim-03",
  "cat": "anim",
  "level": "基础",
  "type": "single",
  "q": "角色有 idle、walk、run 三个移动动画，希望用一个速度参数连续平滑混合，最合适的做法是？",
  "options": [
   "建三个状态，用三个 Trigger 手动切换",
   "用一个 1D Blend Tree，把 Speed 参数作为横轴，三个 Clip 按阈值分布，Threshold 决定各自动画的生效区间",
   "挂三个 Animator 组件分别播放",
   "把三个动画放进同一个状态，Unity 会自动按速度挑选"
  ],
  "answer": [
   1
  ],
  "explain": "1D Blend Tree 用单个参数在多个 Clip 之间按 Threshold 加权混合，适合速度到移动动画这种一维映射；2D Blend Tree 用于方向加速度这类二维输入。多状态加 Trigger 只能硬切，做不出连续混合；一个状态只能放一个 Motion，除非它就是 Blend Tree。追问：2D Freeform Cartesian 与 Directional 的差别、Compute Thresholds 按速度自动排布阈值。",
  "tags": [
   "Blend Tree",
   "混合树",
   "Animator 参数"
  ]
 },
 {
  "id": "anim-04",
  "cat": "anim",
  "level": "基础",
  "type": "single",
  "q": "代码里 animator.Play(\"Attack\")、animator.CrossFade(\"Attack\", 0.1f)、animator.SetTrigger(\"attack\") 的区别，描述正确的是？",
  "options": [
   "三者完全等价，只是写法不同",
   "Play 立即切换、默认无混合；CrossFade 在给定时长内从当前状态混合到目标状态；SetTrigger 只设置参数，是否切换由状态机里的过渡条件决定",
   "SetTrigger 会直接播放名为 attack 的动画",
   "CrossFade 只能作用于 Layer 0"
  ],
  "answer": [
   1
  ],
  "explain": "Play 是硬切，还可以指定 normalizedTime 从某个时间点开始；CrossFade 要求目标状态存在，并在给定时间内做权重混合，适合动作衔接；SetTrigger 只改参数，真正的切换取决于 Transition，状态机里没连线就不会播放。CrossFade 有 layer 参数，可以作用在任意层，不限于 Layer 0。追问：CrossFade 与 CrossFadeInFixedTime 的差别、什么时候用 Trigger 而不是 Bool。",
  "tags": [
   "CrossFade",
   "Play",
   "SetTrigger"
  ]
 },
 {
  "id": "anim-05",
  "cat": "anim",
  "level": "基础",
  "type": "judge",
  "q": "Animation Event 绑定在 AnimationClip 上，运行时在指定时间点调用挂有该 Animator 的 GameObject 上的同名方法（参数需匹配），因此换一个角色复用同一 Clip 时要确认目标脚本是否存在。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "事件是 Clip 资源的一部分，按时间点触发，接收者是播放该 Animator 的 GameObject 上的组件；如果复用 Clip 的角色上没有对应脚本或方法签名不匹配，会报找不到接收者的警告，事件静默失效。事件也不适合放业务重逻辑，因为它受 Clip 长度变化、压缩、过渡打断影响，可能被跳过或重复触发。追问：过渡期间事件被跳过怎么处理、StateMachineBehaviour 能否作为替代。",
  "tags": [
   "Animation Event",
   "动画事件",
   "AnimationClip"
  ]
 },
 {
  "id": "anim-06",
  "cat": "anim",
  "level": "进阶",
  "type": "single",
  "q": "需要「下半身跑步、上半身举枪瞄准」同时生效，正确做法是？",
  "options": [
   "挂两个 Animator 组件，一个播跑步一个播瞄准",
   "在 Animator 里新增一个 Layer，Weight 设为 1，Avatar Mask 只勾选上半身骨骼，Blending 按需求用 Override 或 Additive",
   "把跑步和瞄准做成同一个 Blend Tree，用同一个参数混合",
   "用 Animator.Play 在两个状态之间每帧来回切换"
  ],
  "answer": [
   1
  ],
  "explain": "动画层让不同层同时驱动同一套骨骼，Avatar Mask 限定该层影响哪些骨骼，Layer Weight 控制整体强度；Override 会用上层姿态覆盖下层，Additive 则在下层姿态上叠加偏移。Blend Tree 只在同层、同一套骨骼上做加权混合，无法只驱动上半身。两个 Animator 会互相争夺同一批 Transform，结果不可控。追问：Additive 层的参考姿态从哪来、Mask 与 Layer Weight 同时为 1 时的覆盖关系。",
  "tags": [
   "Avatar Mask",
   "动画层",
   "Layer Weight"
  ]
 },
 {
  "id": "anim-07",
  "cat": "anim",
  "level": "进阶",
  "type": "single",
  "q": "关于 Root Motion，下列说法正确的是？",
  "options": [
   "开启 Apply Root Motion 后角色位移由动画曲线驱动，此时代码里再调 CharacterController.Move 会造成位移叠加或抖动",
   "Root Motion 只对 Humanoid 生效，Generic 永远没有",
   "Root Motion 会把所有骨骼的位移都应用到 GameObject 上",
   "Root Motion 开启后就不再需要 NavMesh 了"
  ],
  "answer": [
   0
  ],
  "explain": "Root Motion 把动画中根骨骼的位移和旋转提取出来应用到角色根节点，适合靠动画驱动的位移，如翻滚、处决、攀爬；如果同时用 CharacterController 或 Rigidbody 再推一次，两套位移会叠加或互相抵消。Generic 也能有 Root Motion，只是需要在导入时正确设置 Root Transform，所以 B 错。它只处理根骨骼运动，不等于全部骨骼位移，寻路依然需要 NavMesh。追问：OnAnimatorMove 里如何自定义 root motion 的应用、Root Motion 与网络同步怎么处理。",
  "tags": [
   "Root Motion",
   "Apply Root Motion",
   "CharacterController"
  ]
 },
 {
  "id": "anim-08",
  "cat": "anim",
  "level": "进阶",
  "type": "multi",
  "q": "场景里有 200 个 NPC 各带一个 Animator，Profiler 中 Animators.Update 占比很高，下列优化有效的有？",
  "options": [
   "把 Culling Mode 设为 Based on Renderers（Cull Update Transforms），屏幕外时停止 Transform 写入",
   "开启 Optimize Game Objects 减少骨骼 Transform 层级与更新开销，并把需要挂点的骨骼保留为 Extra Transforms",
   "减少 Animator 参数数量，并用 Animator.StringToHash 代替字符串访问",
   "为每个 NPC 复制一份 Controller 并各自改参数，避免互相影响"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "动画开销主要来自骨骼 Transform 写入和状态机求值：剔除不可见角色的更新、用 Optimize Game Objects 去掉多余 Transform、减少参数与避免字符串哈希，都能直接降低成本。每个 NPC 复制 Controller 只会增加内存和状态机实例开销，参数本来就是每个 Animator 实例独立的，并不会互相影响，所以 D 无效。追问：Culling Mode 的三个档位区别、GPU Skinning 与 Job/Burst 化的动画方案各自适合什么场景。",
  "tags": [
   "Animator 性能",
   "Culling Mode",
   "Optimize Game Objects"
  ]
 },
 {
  "id": "anim-09",
  "cat": "anim",
  "level": "进阶",
  "type": "single",
  "q": "要把同一套跑步走路动画复用到体型不同、骨骼命名也不一致的角色上，应该选？",
  "options": [
   "Generic，因为 Generic 支持任意骨骼映射",
   "Humanoid，通过 Avatar 把实际骨骼映射到标准人形骨架，动画可以在不同角色之间重定向",
   "Legacy Animation，它的重定向能力最强",
   "只能给每个角色单独做一套动画"
  ],
  "answer": [
   1
  ],
  "explain": "Humanoid 用 Avatar 建立「标准人形骨骼到实际骨骼」的映射，Clip 存的是归一化到肌肉空间的数据，因此能跨角色重定向，代价是映射误差与额外的 CPU 求值开销。Generic 绑定的是具体骨骼路径，换角色通常不能直接复用；Legacy 根本没有重定向能力。追问：Avatar 配置错误（骨骼没变绿）会导致什么、肌肉限制对极端动作表现的影响。",
  "tags": [
   "Humanoid",
   "Generic",
   "Avatar 重定向"
  ]
 },
 {
  "id": "anim-10",
  "cat": "anim",
  "level": "进阶",
  "type": "multi",
  "q": "关于 Playable API 与 Timeline，下列说法正确的有？",
  "options": [
   "Playable Graph 可以在运行时用代码组合 AnimationClipPlayable、Mixer、Layer 等节点，适合程序化动画与技能编排",
   "Timeline 基于 Playable，适合做剧情与过场的时间轴编排，可以混合动画、音频、激活轨道",
   "Playable 能绕过 Animator Controller 直接播放 Clip，因此可以做到比状态机更细粒度的混合控制",
   "Timeline 只能用于 Humanoid 角色，Generic 动画无法播放"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Playable 是底层的可播放图，AnimationClipPlayable 与 Mixer 可以自由组树，Timeline 是它上层的编辑器工具，用于过场与序列编排，所以 A、B 都对。直接播放 Clip 不经过状态机，适合技能与程序化动画，但权重、生命周期和打断都要自己管理。Timeline 的 Animation Track 支持 Generic、Humanoid 以及普通 Transform 轨道，不限于 Humanoid。追问：Playable 与 Animator 同时驱动同一骨骼时谁覆盖谁、如何用 Playable 做动作融合与分层。",
  "tags": [
   "Playable API",
   "Timeline",
   "AnimationClipPlayable"
  ]
 },
 {
  "id": "anim-11",
  "cat": "anim",
  "level": "进阶",
  "type": "judge",
  "q": "把 AnimationClip 的压缩方式设为 Optimal 会做关键帧删减与量化，能显著降低内存和求值开销，但对高精度位移与旋转（例如 Root Motion 驱动的位移）可能产生可见误差，需要按 Clip 调整容差或改用更高精度。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "Optimal 通过删减线性区间内的冗余关键帧并量化数值来压缩，容差越大压缩率越高、误差也越大；旋转通常按四元数量化、位移按浮点压缩，误差累积到 Root Motion 上会表现为漂移或滑步。对位移敏感的 Clip 可以单独提高精度，或者改用 Generic 加自定义曲线。追问：动画压缩与导入设置的 Resample 的关系、压缩后为什么会出现「脚底打滑」。",
  "tags": [
   "动画压缩",
   "Keyframe Reduction",
   "内存"
  ]
 },
 {
  "id": "anim-12",
  "cat": "anim",
  "level": "进阶",
  "type": "single",
  "q": "做 UI 弹窗的缩放弹出和数字滚动，选择 DOTween 而不是 Animator 的主要理由是？",
  "options": [
   "DOTween 能用代码精确控制时长、缓动和回调，适合运行时参数化、可打断的 UI 动效，也不占用 Animator 状态机与 Clip 资源",
   "DOTween 的性能一定高于 Animator，所以角色动画也应该全部改用它",
   "DOTween 只能作用于 UI，不能移动 3D 物体",
   "Animator 无法做缩放动画"
  ],
  "answer": [
   0
  ],
  "explain": "Tween 库擅长一次性、代码参数化、可链式调用也可随时 Kill 的补间动画，UI 弹窗、数字滚动、简单位移这类需求用它更快也更灵活，而且不需要美术做 Clip 和状态机。它每帧在 C# 侧插值，骨骼动画与状态机混合仍应交给 Animator，性能上也不是无脑更优。DOTween 可以作用于 Transform、材质、相机等任意属性，不限于 UI。追问：SetUpdate(true) 与 timeScale 的关系、大量 Tween 的对象池与性能。",
  "tags": [
   "DOTween",
   "UI 动画",
   "Tween"
  ]
 },
 {
  "id": "anim-13",
  "cat": "anim",
  "level": "高级",
  "type": "single",
  "q": "需要让角色双脚贴合高低不平的地面，用 OnAnimatorIK 实现的核心步骤是？",
  "options": [
   "在 Update 里直接修改脚部骨骼的 localPosition",
   "开启 Animator 的 IK Pass，在 OnAnimatorIK 中向下 Raycast 找到地面，用 SetIKPosition 配合 AvatarIKGoal.LeftFoot 设置目标，并给 SetIKPositionWeight、SetIKRotationWeight 赋权重，必要时用 SetIKHintPosition 控制膝盖朝向",
   "把 Avatar 改成 Generic 就能自动贴地",
   "只调用 SetLookAtWeight，脚部会自动对齐"
  ],
  "answer": [
   1
  ],
  "explain": "打开 IK Pass 后 Unity 会在动画求值之后回调 OnAnimatorIK，此时写入的 IK 目标才不会被当帧动画覆盖；权重从 0 平滑过渡到 1 可以避免瞬移，Hint 用来固定膝盖或肘部朝向，防止反关节。直接在 Update 里改骨骼 localPosition 会被动画写回覆盖。追问：IK 与 Root Motion 的执行顺序、两段式 IK（先算脚再下沉骨盆）怎么实现、多个 IK 目标的优先级。",
  "tags": [
   "IK",
   "OnAnimatorIK",
   "AvatarIKGoal"
  ]
 },
 {
  "id": "anim-14",
  "cat": "anim",
  "level": "高级",
  "type": "multi",
  "q": "实现「受击后被物理击退并倒地」，下列方案合理的有？",
  "options": [
   "受击瞬间用 Additive 层叠加受击姿态，同时由代码施加冲量，位移交给 Rigidbody，动画层只负责姿态",
   "把 Animator 的 Update Mode 设为 Animate Physics，或在 OnAnimatorMove 中把 Root Motion 位移交给 Rigidbody.MovePosition，避免动画与物理各推一套位移",
   "倒地阶段切换到 Ragdoll 让物理接管骨骼，起身时用姿态匹配或 IK 过渡回动画",
   "让 Animator 的 Root Motion 和 Rigidbody 各自驱动位移，效果会更自然"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "动画与物理混合的关键是「位移只能有一个权威来源」：要么 Root Motion 驱动、物理只负责碰撞，要么物理驱动、动画只负责姿态。Additive 层可以在不打断基础移动动画的前提下叠加受击反应；Animate Physics 让动画与物理步进对齐，OnAnimatorMove 可以自定义位移的应用方式；Ragdoll 适合倒地，起身用姿态匹配或 IK 过渡回动画。D 会造成位移叠加和抖动。追问：Ragdoll 与 Animator 切换时如何避免瞬移和穿模、受击动画如何做打断与优先级。",
  "tags": [
   "物理动画",
   "Additive",
   "Ragdoll"
  ]
 },
 {
  "id": "anim-15",
  "cat": "anim",
  "level": "高级",
  "type": "single",
  "q": "用序列帧做一个 2D 技能特效（30 帧、512x512、带 Alpha），下列做法最合理的是？",
  "options": [
   "把 30 张图打进图集，用 SpriteRenderer 配合 Animation Clip 或代码切换 Sprite，并控制图集尺寸与透明区域带来的 Overdraw",
   "为每一帧创建一个 GameObject，运行时切换激活状态",
   "把 30 张图合成一张 8K 贴图用 UV 偏移采样，永远比图集更好",
   "序列帧只能用 Legacy Animation 播放"
  ],
  "answer": [
   0
  ],
  "explain": "序列帧的主要成本是显存与填充率：打图集能减少材质切换与 Draw Call，SpriteRenderer 配合 Animation 或代码切 Sprite 都能播；带 Alpha 的大图 Overdraw 明显，需要裁掉透明边、控制同屏数量。逐帧 GameObject 会带来大量激活与销毁开销，8K 贴图在移动端超出常见纹理尺寸上限且浪费显存。追问：帧动画与骨骼动画在表现力和内存上的取舍、图集打包与 Sprite Atlas 的变体管理。",
  "tags": [
   "序列帧",
   "Sprite",
   "图集"
  ]
 },
 {
  "id": "anim-16",
  "cat": "anim",
  "level": "高级",
  "type": "judge",
  "q": "Animator 的 Trigger 参数被某个过渡消费后会自动复位；如果同一帧内连续 SetTrigger 两次同名 Trigger，第二次会覆盖第一次，不会排队播放两次。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "Trigger 本质是一个「被消费即清零」的 Bool，同一帧多次设置只会留下一个待消费标记，所以连招和连续攻击不能靠重复 SetTrigger 实现，需要计数参数、动作队列，或者直接 Play/CrossFade。另外如果状态机里没有任何过渡消费该 Trigger，它会一直保持为真，导致下一次进入状态时立刻触发。追问：如何用 int 参数加过渡做连击计数、ResetTrigger 的使用场景、Trigger 与 Bool 在打断逻辑上的差异。",
  "tags": [
   "SetTrigger",
   "Animator 参数",
   "连招"
  ]
 },
 {
  "id": "ui-01",
  "cat": "ui",
  "level": "基础",
  "type": "single",
  "q": "UGUI 中一个 Image 从被标记为脏到最终提交给 GPU，下面哪条链路是正确的？",
  "options": [
   "Graphic 生成顶点 → Canvas 收集 CanvasRenderer → Canvas.BuildBatch 合批 → 提交 GPU",
   "Graphic → MeshRenderer → Canvas → GPU",
   "CanvasRenderer → Graphic → Canvas → GPU，全程不产生合批",
   "Canvas → CanvasRenderer → Graphic → GPU，每个 Image 固定一次 Draw Call"
  ],
  "answer": [
   0
  ],
  "explain": "UGUI 里 Graphic（Image/Text）只负责 OnPopulateMesh 生成顶点，CanvasRenderer 持有网格，Canvas 才是重建与合批的单位：一次 BuildBatch 把同材质、同图集且层级连续的 CanvasRenderer 合成一个批次。MeshRenderer 不参与 UGUI 渲染。正因为 Canvas 是整批重建，改动一个元素才会牵动同 Canvas 下的其它元素，这也是 Canvas 拆分优化的根源。",
  "tags": [
   "UGUI",
   "Canvas",
   "合批",
   "CanvasRenderer"
  ]
 },
 {
  "id": "ui-02",
  "cat": "ui",
  "level": "基础",
  "type": "single",
  "q": "一个 100×100 的 Image，anchorMin = anchorMax = (1, 0)，pivot = (1, 0)，希望它的右下角始终贴在父节点右下角，anchoredPosition 应设为多少？",
  "options": [
   "(0, 0)",
   "(50, 50)",
   "(-50, -50)",
   "(100, 100)"
  ],
  "answer": [
   0
  ],
  "explain": "anchoredPosition 是 pivot 相对锚点参考点的偏移；四个锚点值相等时，参考点就是父节点上的那个点。pivot=(1,0) 把轴心放在图片右下角，所以 (0,0) 恰好让右下角与父节点右下角重合。填 (-50,-50) 是把 pivot 当成中心又想做半宽偏移的典型错误。追问：anchorMin≠anchorMax 进入拉伸模式后，sizeDelta 的含义是什么（相对父尺寸的差值，而非绝对尺寸）。",
  "tags": [
   "RectTransform",
   "锚点",
   "轴心"
  ]
 },
 {
  "id": "ui-03",
  "cat": "ui",
  "level": "基础",
  "type": "single",
  "q": "一套 1920×1080 设计的 UI 要同时适配 16:9 手机和 4:3 平板，要求宽度方向优先保证不裁切，CanvasScaler 应如何配置？",
  "options": [
   "Scale With Screen Size，Match Width Or Height = 0（按宽度匹配）",
   "Scale With Screen Size，Match Width Or Height = 1（按高度匹配）",
   "Constant Pixel Size，Reference Pixels Per Unit 调大",
   "Constant Physical Size，按 DPI 缩放"
  ],
  "answer": [
   0
  ],
  "explain": "Match=0 时缩放系数只由宽度决定，横向布局不会被裁，纵向多出来的空间靠锚点和留白处理；Match=1 按高度缩放，在更宽的屏幕上会把整个 Canvas 放大，横向元素容易被裁掉。Constant Pixel Size 不随分辨率变化，仅适合固定分辨率或工具类界面；Constant Physical Size 按物理尺寸换算，移动端很少用。追问：横竖屏切换时 CanvasScaler 与 SafeArea 的配合顺序。",
  "tags": [
   "CanvasScaler",
   "UI适配",
   "分辨率"
  ]
 },
 {
  "id": "ui-04",
  "cat": "ui",
  "level": "基础",
  "type": "judge",
  "q": "判断：UGUI 的 Text 和 TextMeshPro 在修改文本时都会重建所在 Canvas 的合批，因此两者的性能没有本质差别。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "两者修改文本都会 SetVerticesDirty，最终都触发所在 Canvas 的 Graphic rebuild，这一点相似；差别在于生成成本与字体图集管理。Text 使用动态字体，字符首次出现或图集扩张时会触发 Font.textureRebuilt，让所有引用该字体的 Text 重建，且每个字符一个 quad；TMP 使用预生成 SDF 图集和更高效的网格生成，字符数多、频繁刷新时优势明显。追问：TMP 首次显示生僻字为什么会卡一下（图集扩容 + 材质贴图重建）。",
  "tags": [
   "Text",
   "TextMeshPro",
   "字体图集"
  ]
 },
 {
  "id": "ui-05",
  "cat": "ui",
  "level": "基础",
  "type": "single",
  "q": "场景里按钮点击无反应，确认按钮 Image 的 Raycast Target 已勾选。以下哪项最不可能是原因？",
  "options": [
   "场景中没有 EventSystem",
   "Canvas 上没有挂 Graphic Raycaster",
   "EventSystem 的输入模块与当前 Input System 不匹配",
   "Canvas 的 Render Mode 是 Screen Space - Overlay"
  ],
  "answer": [
   3
  ],
  "explain": "Overlay 模式本身完全不影响点击，它只是决定 Canvas 画在哪个相机之后。常见故障是缺 EventSystem、缺 Graphic Raycaster、EventSystem 上挂的是 StandaloneInputModule 而项目启用了新 Input System（应改用 InputSystemUIInputModule），或者上层有 raycastTarget=true 的全屏透明 Image 把命中截走。追问：怎样用 EventSystem.current.RaycastAll 打印出当前点击被哪个对象挡住。",
  "tags": [
   "EventSystem",
   "GraphicRaycaster",
   "InputSystem"
  ]
 },
 {
  "id": "ui-06",
  "cat": "ui",
  "level": "进阶",
  "type": "single",
  "q": "每帧只改一个 Text 的文字，Profiler 里 Canvas.SendWillRenderCanvases 却占了 3~4ms，最准确的解释是？",
  "options": [
   "Text 修改只影响自己的 CanvasRenderer，不会触发 Canvas 重建",
   "顶点变脏后所在 Canvas 会整体重建批次，同 Canvas 下 Graphic 越多、网格越复杂，单点修改越贵",
   "每次改文字都会触发 Resources.UnloadUnusedAssets",
   "只有 LayoutGroup 变化才会重建，Text 不会造成重建"
  ],
  "answer": [
   1
  ],
  "explain": "Graphic.SetVerticesDirty 会把所属 Canvas 标记为 dirty，下一帧 Canvas 重建的是该 Canvas 下所有批次，而不是只重建被改的那个 Text，所以同 Canvas 元素越多成本越高。Layout 重建（LayoutRebuilder）和 Graphic 重建是两条独立路径，Text 只走后者。常见解法是把高频刷新的文本（倒计时、分数）放进独立子 Canvas。追问：什么操作会走 Layout 重建而不是顶点重建。",
  "tags": [
   "Rebuild",
   "脏标记",
   "Canvas"
  ]
 },
 {
  "id": "ui-07",
  "cat": "ui",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些做法有助于减少 UGUI 的 Draw Call？（多选）",
  "options": [
   "把同一界面用到的零散小图打进同一个 Sprite Atlas",
   "在两层同图集的 Image 之间插入一个使用不同材质的 Image",
   "把材质一致、层级连续的 UI 元素放在同一个 Canvas 下",
   "给每个 Image 单独指定不同材质，方便各自调参"
  ],
  "answer": [
   0,
   2
  ],
  "explain": "合批的硬条件是材质/图集相同、渲染顺序连续，中间插入不同材质会把批次切成两段，Draw Call 反而增加；每个元素独立材质等于主动放弃合批。同图集加连续层级是最直接的降 Draw Call 手段，但要注意图集过大会带来加载粒度粗、内存峰值高的问题。追问：为什么 Mask 也会打断合批（Stencil 需要额外 pass 与状态切换）。",
  "tags": [
   "图集",
   "合批",
   "DrawCall"
  ]
 },
 {
  "id": "ui-08",
  "cat": "ui",
  "level": "进阶",
  "type": "single",
  "q": "滚动列表需要裁剪超出可视区域的内容，关于 Mask 与 RectMask2D 的说法正确的是？",
  "options": [
   "Mask 依赖模板缓冲（Stencil），通常额外增加 Draw Call 并打断合批；RectMask2D 只支持矩形裁剪但开销更低",
   "RectMask2D 支持任意形状裁剪，而且比 Mask 更贵",
   "两者底层实现相同，只是组件命名不同",
   "Mask 不会打断合批，RectMask2D 才会打断合批"
  ],
  "answer": [
   0
  ],
  "explain": "Mask 通过 Stencil 写入/测试实现裁剪，需要额外的 pass 和材质状态切换，通常会让被裁剪内容多出 2 个左右 Draw Call 并中断同 Canvas 合批；RectMask2D 用矩形裁剪参数在 shader 里 discard，不增加额外 pass，是列表、窗口这类矩形裁剪的首选。圆角、异形裁剪才需要 Mask 或自定义 shader。追问：多层 RectMask2D 嵌套时裁剪区域如何求交。",
  "tags": [
   "Mask",
   "RectMask2D",
   "裁剪"
  ]
 },
 {
  "id": "ui-09",
  "cat": "ui",
  "level": "进阶",
  "type": "judge",
  "q": "判断：把上层遮挡 Image 的 Raycast Target 取消勾选，或者把它的 CanvasGroup.blocksRaycasts 设为 false，都能让点击穿透到下层 UI。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "GraphicRaycaster 只对 raycastTarget=true 的 Graphic 做命中测试，取消勾选后该 Image 不再参与射线检测，点击自然落到下层；CanvasGroup.blocksRaycasts=false 会让整个子树的 Graphic 都不参与射线检测，但视觉显示不受影响。注意 blocksRaycasts 作用于整个 CanvasGroup 子树，只想让某个子节点穿透时要单独加 CanvasGroup。追问：blocksRaycasts 与 interactable、alpha 三者的区别。",
  "tags": [
   "点击穿透",
   "RaycastTarget",
   "CanvasGroup"
  ]
 },
 {
  "id": "ui-10",
  "cat": "ui",
  "level": "进阶",
  "type": "single",
  "q": "一个背包格子预制体同时挂了 VerticalLayoutGroup、ContentSizeFitter（Vertical Fit = Preferred Size）和 LayoutElement，列表滚动时 CPU 明显偏高，最可能的原因是？",
  "code": "// 每个格子\nvar vlg = go.AddComponent<VerticalLayoutGroup>();\nvar fitter = go.AddComponent<ContentSizeFitter>();\nfitter.verticalFit = ContentSizeFitter.FitMode.PreferredSize;\n// 滚动时还在改 content.anchoredPosition",
  "options": [
   "LayoutGroup 触发布局计算改变子物体尺寸，ContentSizeFitter 又依尺寸反向触发布局，形成级联重建",
   "ContentSizeFitter 只在 Start 执行一次，运行时没有开销",
   "LayoutGroup 的计算在 GPU 上完成，瓶颈是填充率",
   "只要把格子的 Raycast Target 关掉就能消除这部分开销"
  ],
  "answer": [
   0
  ],
  "explain": "Layout 重建是 CPU 行为：LayoutGroup 收集子物体、算 min/preferred size、回写 RectTransform，ContentSizeFitter 根据子物体尺寸反过来改自身尺寸，很容易形成多轮 Rebuild，嵌套越深越贵。滚动时如果还伴随 SetActive 或改 padding，会每帧触发重建。Raycast Target 只影响射线检测，与布局无关。追问：LayoutRebuilder.ForceRebuildLayoutImmediate 为什么在热路径上更危险。",
  "tags": [
   "LayoutGroup",
   "ContentSizeFitter",
   "布局重建"
  ]
 },
 {
  "id": "ui-11",
  "cat": "ui",
  "level": "进阶",
  "type": "multi",
  "q": "做一个“按钮按下轻微缩放 + 提示文字淡出”的动画，以下哪些是推荐做法？（多选）",
  "options": [
   "用 Animator 或 DOTween 改 RectTransform.localScale 和 CanvasGroup.alpha",
   "每帧修改 LayoutGroup 的 padding 来实现位移动画",
   "动画前缓存 Transform、CanvasGroup 引用，避免在回调里反复 GetComponent",
   "每帧调用 SetNativeSize 让文字跟随缩放"
  ],
  "answer": [
   0,
   2
  ],
  "explain": "localScale 和 CanvasGroup.alpha 不触发布局重建，属于变换与批次属性的更新，是 UI 动画的首选通道；改 LayoutGroup padding 会触发 Layout 重建，SetNativeSize 会改尺寸并触发顶点重建，两者都会把一次动画放大成每帧重建。缓存引用则是避免每帧 GetComponent 的通用要求。追问：为什么改 Image.color 通常比改材质属性便宜（顶点色随网格走，不产生材质实例）。",
  "tags": [
   "UI动画",
   "CanvasGroup",
   "布局重建"
  ]
 },
 {
  "id": "ui-12",
  "cat": "ui",
  "level": "进阶",
  "type": "single",
  "q": "1000 项的排行榜用 ScrollRect + VerticalLayoutGroup 一次性实例化全部 Item，进入界面卡顿数秒。最有效的优化是？",
  "options": [
   "把 Item 的 Raycast Target 全部关掉",
   "改成虚拟列表：只创建可视区域加缓冲数量的 Item，滚动时复用节点并刷新数据",
   "把 Canvas 的 Render Mode 改成 World Space",
   "给 Content 再加一个 ContentSizeFitter"
  ],
  "answer": [
   1
  ],
  "explain": "一次性实例化 1000 个 Item 意味着 1000 个 Graphic、一次 O(n) 的布局计算和大量顶点，实例化与首帧布局都会炸；虚拟列表把节点数降到可视数量级（通常 10~30 个），滚动只改 anchoredPosition 并复用节点刷新数据，复杂度从 O(n) 降到 O(可视数)。注意复用时要重置状态，避免频繁 SetActive 引起重建抖动。追问：不等高 Item 如何做虚拟列表（前缀和 + 二分查找定位起始索引）。",
  "tags": [
   "ScrollRect",
   "虚拟列表",
   "对象池"
  ]
 },
 {
  "id": "ui-13",
  "cat": "ui",
  "level": "高级",
  "type": "single",
  "q": "真机上 UI 帧耗时高，用 Unity Profiler 排查时，哪个指标最能直接定位“UI 每帧在重建”这类问题？",
  "options": [
   "Canvas.SendWillRenderCanvases 的耗时与调用频率",
   "GarbageCollector 的每帧分配量",
   "Physics.Processing 的耗时",
   "Audio.DSP 的占用"
  ],
  "answer": [
   0
  ],
  "explain": "UGUI 的 Layout 与 Graphic 重建都发生在 Canvas.SendWillRenderCanvases 里，它的耗时和每帧是否持续出现，能直接区分“持续重建”与“偶发一次”。再配合 Profiler 的 UI 模块看 batches/rebuild 数、Frame Debugger 看实际 Draw Call，就能判断瓶颈是重建还是填充率。GC 分配高属于另一类问题，物理和音频模块与 UI 重建无关。追问：如果 SendWillRenderCanvases 很低但 GPU 很高，下一步看什么（Overdraw）。",
  "tags": [
   "Profiler",
   "Rebuild",
   "UI性能"
  ]
 },
 {
  "id": "ui-14",
  "cat": "ui",
  "level": "高级",
  "type": "multi",
  "q": "需要让 3D 粒子和 UGUI 正确穿插（粒子夹在某两个 UI 层之间），以下哪些方案可行？（多选）",
  "options": [
   "Canvas 改为 Screen Space - Camera，用多个 Canvas 设置不同 sortingOrder 与 plane distance，把粒子夹在中间",
   "使用 World Space Canvas，让粒子和 UI 一起参与相机的深度/排序",
   "坚持 Screen Space - Overlay，粒子不可能与 UI 穿插",
   "把粒子渲染到 RenderTexture，再用 RawImage 显示在指定 UI 层级"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "Overlay 模式的 Canvas 在所有相机之后统一绘制，天然压在最上层，无法与场景物体按深度穿插；Screen Space - Camera 和 World Space 让 Canvas 进入相机渲染队列，可以用 sortingOrder、RenderQueue 和相机距离把粒子夹在两层 UI 之间。RenderTexture + RawImage 是把粒子“UI 化”的兜底方案，代价是多一次渲染与 blit，还要处理分辨率和透明边缘。追问：粒子用 Transparent 队列且关闭 ZWrite 时，排序依据是什么。",
  "tags": [
   "粒子",
   "渲染排序",
   "WorldSpace"
  ]
 },
 {
  "id": "ui-15",
  "cat": "ui",
  "level": "高级",
  "type": "single",
  "q": "关于 Canvas 拆分的说法，正确的是？",
  "options": [
   "把高频变化的小元素放进独立子 Canvas，可把重建限制在该子 Canvas 内，但每个子 Canvas 至少增加一个批次",
   "拆得越细越好，Canvas 数量不影响性能",
   "子 Canvas 不能隔离重建，只是层级上的视觉分组",
   "拆 Canvas 会减少 Draw Call，因为所有 Canvas 最终会自动合并成一个批次"
  ],
  "answer": [
   0
  ],
  "explain": "子 Canvas 是独立的重建与合批单元：改子 Canvas 里的元素只重建该 Canvas，父 Canvas 不受影响，这是隔离高频刷新 UI 的标准手段。但每个 Canvas 至少产生一个批次，且子 Canvas 与父 Canvas 之间不能合批，拆太碎会让 Draw Call 上升。实践中按“静态背景 / 高频动态元素 / 弹窗”粗粒度拆分，而不是一个元素一个 Canvas。追问：嵌套 Canvas 的 dirty 标记会不会向上传播。",
  "tags": [
   "Canvas拆分",
   "重建隔离",
   "批次"
  ]
 },
 {
  "id": "ui-16",
  "cat": "ui",
  "level": "高级",
  "type": "judge",
  "q": "判断：处理刘海屏时，只要给根 Canvas 挂一个 SafeArea 脚本设置 anchorMin/anchorMax，就能保证所有子 UI 都避开刘海。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "改根节点的锚点只是收缩了根 RectTransform 的可用区域，子元素如果使用固定 anchoredPosition、负偏移或全屏铺满（背景图、贴边按钮）仍会跑到安全区外。正确做法是背景单独铺满全屏，内容放在一个受 SafeArea 约束的容器下，并在横竖屏切换、分辨率变化时重新读取 Screen.safeArea 计算。追问：Editor 下如何模拟刘海（Device Simulator）以及 Android 上 cutout 模式的差异。",
  "tags": [
   "SafeArea",
   "刘海屏",
   "适配"
  ]
 },
 {
  "id": "perf-01",
  "cat": "perf",
  "level": "基础",
  "type": "single",
  "q": "在 Editor 里用 Profiler 定位卡顿，开启 Deep Profile 后帧率骤降。下面哪种理解是正确的？",
  "options": [
   "Deep Profile 会对每个方法调用插桩记录，开销可达数倍到数十倍，只适合短时间定位热点，不能用来评估真实帧率",
   "Deep Profile 会关闭 GC，所以内存数据不准",
   "Deep Profile 只影响 GPU 采集，CPU 数据仍然准确",
   "Deep Profile 必须配合 Development Build 才能启用"
  ],
  "answer": [
   0
  ],
  "explain": "Deep Profile 通过逐方法记录调用栈来定位热点，单帧开销远高于正常运行，帧率与耗时数据都会失真，只应短时间开启；常规流程是先用普通 Profiler 看模块级耗时，再局部开 Deep Profile 或看 Hierarchy 自下而上定位。真机分析则用 Development Build + Autoconnect Profiler。追问：为什么 Editor 的数据和 IL2CPP 真机差别很大（Mono/IL2CPP、JIT、编译优化）。",
  "tags": [
   "Profiler",
   "DeepProfile",
   "性能分析"
  ]
 },
 {
  "id": "perf-02",
  "cat": "perf",
  "level": "基础",
  "type": "single",
  "q": "目标 60 FPS 的手游，QualitySettings.vSyncCount = 0，Application.targetFrameRate 应设为多少？对应每帧预算约多少毫秒？",
  "options": [
   "30，约 33.3ms",
   "60，约 16.6ms",
   "-1，由系统动态决定，无需关心预算",
   "120，约 8.3ms"
  ],
  "answer": [
   1
  ],
  "explain": "vSyncCount=0 时 targetFrameRate 才真正生效；60 FPS 对应 1000/60≈16.6ms，这是 CPU 主线程与 GPU 共同的上限，实际项目一般只用到 13~14ms，给波动留余量。设为 30 则预算 33.3ms，是移动端省电降温的常见选择；-1 表示不限制，会导致帧率随负载剧烈波动、发热更严重。追问：设了 targetFrameRate 仍达不到 60 时如何判断瓶颈在 CPU 还是 GPU。",
  "tags": [
   "vsync",
   "targetFrameRate",
   "性能预算"
  ]
 },
 {
  "id": "perf-03",
  "cat": "perf",
  "level": "基础",
  "type": "single",
  "q": "下面哪段 Update 代码最可能在运行时产生持续的 GC 分配？",
  "code": "void Update()\n{\n    scoreText.text = \"Score: \" + score;\n    transform.position += Vector3.forward * Time.deltaTime;\n    if (Input.GetKeyDown(KeyCode.Space)) { }\n    var t = transform;\n}",
  "options": [
   "scoreText.text = \"Score: \" + score; 每次拼接都会生成新的 string",
   "transform.position += Vector3.forward * Time.deltaTime; 会分配 Vector3",
   "Input.GetKeyDown(KeyCode.Space) 每次都会装箱",
   "var t = transform; 会复制整个 Transform 对象"
  ],
  "answer": [
   0
  ],
  "explain": "string 是不可变引用类型，每次 \"+\" 都会在堆上生成新字符串（int 转字符串也有分配）；按每帧 50~100 字节算，60 FPS 下约 3~6KB/s，单看不致命，但叠加上日志、装箱、LINQ 后很快就会触发 GC。Vector3 是 struct 不进堆，transform 是引用复制，GetKeyDown 也不装箱。正确做法是数值变化时才更新文本，并用 StringBuilder 或缓存字符串。追问：为什么 Text.text 赋相同内容不会触发重建（setter 内部比较字符串内容）。",
  "tags": [
   "GC",
   "字符串拼接",
   "每帧分配"
  ]
 },
 {
  "id": "perf-04",
  "cat": "perf",
  "level": "基础",
  "type": "judge",
  "q": "判断：Physics.Raycast 在 FixedUpdate 中调用不会影响主线程帧率，因为物理系统运行在独立线程。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Unity 的物理模拟与查询 API 都在主线程的 FixedUpdate 阶段同步执行，射线检测本身不产生 GC，但高频调用、MeshCollider、缺少 LayerMask 过滤都会明显吃 CPU。默认 FixedUpdate 间隔 0.02s（50Hz），把 Time.fixedDeltaTime 调小会线性增加物理计算次数。高频查询应使用 RaycastNonAlloc 复用结果数组并加 LayerMask。追问：FixedUpdate 与 Update 的调用频率关系，以及物理更新发生在哪一步。",
  "tags": [
   "物理",
   "FixedUpdate",
   "Raycast"
  ]
 },
 {
  "id": "perf-05",
  "cat": "perf",
  "level": "基础",
  "type": "single",
  "q": "关于 struct 与 class 的性能取舍，下列说法正确的是？",
  "options": [
   "struct 是值类型，通常在栈上或内联存储，不产生 GC；但按值传递和放入集合会复制，过大时复制成本可能超过 class",
   "struct 一定比 class 快，应该把业务数据全部改成 struct",
   "class 是引用类型，所以永远不会产生 GC",
   "struct 不能实现接口，因此不能用于泛型集合"
  ],
  "answer": [
   0
  ],
  "explain": "struct 适合小而短命的数据（Vector3、RaycastHit），能避免堆分配与 GC；但复制是按字节拷贝，超过约 16~24 字节后收益迅速下降，作为 Dictionary 的 key 时若没实现 IEquatable<T> 还会走装箱/反射式比较。class 适合有身份、生命周期长、需要继承和多态的对象。追问：为什么把 struct 赋给接口变量会发生装箱。",
  "tags": [
   "struct",
   "class",
   "GC"
  ]
 },
 {
  "id": "perf-06",
  "cat": "perf",
  "level": "基础",
  "type": "single",
  "q": "用对象池替代频繁 Instantiate/Destroy 子弹，以下哪项不是对象池必须处理的问题？",
  "options": [
   "取出时重置状态，例如速度、计时器、事件订阅和动画",
   "回收时 SetActive(false) 并入池，同时限制池容量避免无限增长",
   "为保证每次取出的对象“干净”，回收时销毁并在取出时重新 Instantiate",
   "场景切换或 Domain Reload 时清理池中的引用"
  ],
  "answer": [
   2
  ],
  "explain": "对象池的价值就是避免重复 Instantiate（克隆、Awake/OnEnable、资源加载）和 Destroy（GC 与销毁开销），每次重新实例化等于放弃全部收益。必须处理的是状态重置、容量上限、重复回收检测、跨场景清理，否则会出现状态残留或池无限膨胀。追问：池对象上残留的协程与事件订阅会导致什么问题。",
  "tags": [
   "对象池",
   "Instantiate",
   "复用"
  ]
 },
 {
  "id": "perf-07",
  "cat": "perf",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些写法会在运行时产生托管堆分配？（多选）",
  "options": [
   "在 Update 里写 () => { } 并捕获局部变量，形成闭包",
   "对 List<int> 调用 Where(...).ToList()",
   "用 foreach 遍历 List<int>",
   "把 int 存进 Dictionary<string, object>"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "捕获局部变量的 lambda 会让编译器生成一个闭包类实例；LINQ 每次调用分配迭代器与委托，ToList 再分配 List 和内部数组；int 存入 object 是装箱，取出时还要拆箱。foreach 遍历 List<T> 使用的是 struct 枚举器，不产生分配（但遍历 IEnumerable<T> 接口会装箱枚举器）。追问：如何用 Profiler 的 GC Alloc 列验证优化后是否达到 0B/帧。",
  "tags": [
   "GC",
   "闭包",
   "LINQ",
   "装箱"
  ]
 },
 {
  "id": "perf-08",
  "cat": "perf",
  "level": "进阶",
  "type": "single",
  "q": "以下哪种情况最可能导致“切场景后托管内存不降反升”的泄漏？",
  "options": [
   "静态事件或静态字典持有场景对象的引用，切场景时没有清空",
   "用 using 包裹的 FileStream 在方法结束时被释放",
   "局部变量在方法返回后超出作用域",
   "在 Update 中读取 Time.deltaTime"
  ],
  "answer": [
   0
  ],
  "explain": "静态字段（包括 static event、单例缓存、lambda 捕获）属于 GC Root，会一直持有场景对象，使其无法被回收；事件只 += 不 -= 也是同类问题。Resources.UnloadUnusedAssets 只处理没有被引用的 UnityEngine.Object，管不了托管引用链。定位时用 MemoryProfiler 查看对象引用路径，确认是谁在持有。追问：为什么静态引用在 Editor 的 Domain Reload 关闭后更容易“假装泄漏”。",
  "tags": [
   "内存泄漏",
   "静态引用",
   "事件解绑"
  ]
 },
 {
  "id": "perf-09",
  "cat": "perf",
  "level": "进阶",
  "type": "single",
  "q": "关于 Resources 目录的使用，下列说法正确的是？",
  "options": [
   "Resources 下的资源会全部打进包体并在启动时建立索引，官方建议只放少量必要资源，其余用 Addressables/AssetBundle",
   "Resources.Load 出来的资源只要 Destroy 实例就会自动释放内存",
   "Resources.UnloadUnusedAssets 可以立即释放所有未使用资源，适合每帧调用",
   "Resources 目录支持按需下载，不会增加包体大小"
  ],
  "answer": [
   0
  ],
  "explain": "Resources 目录的内容会全量进入安装包，并生成启动时加载的资源索引，目录越大启动越慢、包体越大，所以官方建议仅保留极少量必须资源。Destroy 只销毁实例，资源本体要等 UnloadUnusedAssets 或 UnloadAsset 才释放；UnloadUnusedAssets 是异步且开销较大，通常在切场景后调用一次。追问：Addressables 的引用计数机制与何时释放句柄。",
  "tags": [
   "Resources",
   "资源管理",
   "Addressables"
  ]
 },
 {
  "id": "perf-10",
  "cat": "perf",
  "level": "进阶",
  "type": "single",
  "q": "一张 2048×2048 的 UI 纹理，格式 RGBA32 且开启 Mipmap，运行时占用显存大约是？",
  "options": [
   "4 MB",
   "16 MB",
   "约 21 MB",
   "64 MB"
  ],
  "answer": [
   2
  ],
  "explain": "2048×2048×4 字节 = 16MB，Mipmap 额外增加约 1/3，合计约 21.3MB。如果改为 ASTC 4×4（1 字节/像素），同样带 Mipmap 约 5.3MB；UI 通常不需要 Mipmap，且应关闭 Read/Write，否则 CPU 侧还会保留一份拷贝。追问：ETC2、ASTC、PVRTC 分别适合什么平台与内容类型。",
  "tags": [
   "纹理",
   "显存",
   "压缩格式"
  ]
 },
 {
  "id": "perf-11",
  "cat": "perf",
  "level": "进阶",
  "type": "judge",
  "q": "判断：把音频的 Load Type 从 Decompress On Load 改成 Compressed In Memory，会增加运行时内存占用。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Decompress On Load 在加载时就把压缩数据解成 PCM 常驻内存，内存占用最大但播放时几乎不耗 CPU；Compressed In Memory 只保留压缩数据，播放时实时解码，内存更小、CPU 更高；Streaming 内存最小但 IO 频繁，适合长 BGM。短音效通常用 Decompress On Load 换 CPU，长音乐用 Streaming。追问：Vorbis 与 PCM 在移动端的解码开销差异。",
  "tags": [
   "音频",
   "内存",
   "LoadType"
  ]
 },
 {
  "id": "perf-12",
  "cat": "perf",
  "level": "进阶",
  "type": "single",
  "q": "关于 Unity 的几种合批方式，说法正确的是？",
  "options": [
   "静态合批在构建期合并网格、用内存换 Draw Call 且对象不可移动；动态合批有顶点数上限；SRP Batcher 主要降低 SetPass 开销而非严格减少 Draw Call",
   "动态合批没有顶点数限制，适合所有复杂模型",
   "SRP Batcher 要求所有材质参数完全一致才能生效",
   "静态合批的对象在运行时可以自由移动，只是不能改材质"
  ],
  "answer": [
   0
  ],
  "explain": "Static Batching 把静态网格烘进大 buffer，代价是常驻内存增加且物体不能移动；Dynamic Batching 有大约 300 顶点、900 顶点属性的上限，复杂网格合不了；SRP Batcher 按 Shader 变体组织 CBUFFER，减少材质切换引起的 SetPass 与状态设置，但 Draw Call 数量未必下降。追问：GPU Instancing 生效需要哪些条件（同网格同材质、开启开关）。",
  "tags": [
   "合批",
   "SRPBatcher",
   "DrawCall"
  ]
 },
 {
  "id": "perf-13",
  "cat": "perf",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些手段能直接降低 CPU 端的渲染开销？（多选）",
  "options": [
   "对静态场景使用 Static Batching 或 GPU Instancing",
   "用 LOD Group、视锥剔除和遮挡剔除减少可见物体",
   "把高频刷新的 UI 拆到独立子 Canvas，避免整个 Canvas 重建",
   "给所有材质新增更多 Shader Variant 以提升画质"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "合批与 Instancing 降低 SetPass 和提交次数；LOD 与剔除减少可见 draw call 与顶点处理；拆分 Canvas 把 UGUI 的 rebuild 限制在局部，属于典型的 CPU 侧优化。新增 Shader Variant 只会增加包体、编译和加载成本，对 CPU 渲染开销没有帮助，画质提升也不来自变体数量。追问：Overdraw 主要算 CPU 还是 GPU 瓶颈（GPU 填充率）。",
  "tags": [
   "LOD",
   "剔除",
   "合批",
   "UI重建"
  ]
 },
 {
  "id": "perf-14",
  "cat": "perf",
  "level": "进阶",
  "type": "single",
  "q": "移动端 UI 界面帧率低，Profiler 显示 CPU 主线程耗时正常但 GPU 耗时很高，最可能的原因是？",
  "options": [
   "Overdraw 严重：多层半透明 UI、全屏遮罩和粒子叠加把填充率打满",
   "脚本里有大量字符串拼接导致 GC",
   "Canvas 重建次数过多",
   "场景里的碰撞体数量太多"
  ],
  "answer": [
   0
  ],
  "explain": "CPU 正常而 GPU 高，优先怀疑 fillrate：每一层全屏半透明 Image 都会让被覆盖像素重复着色，移动端 GPU 对带宽和填充率非常敏感；粒子和全屏后处理会进一步放大。字符串拼接与 Canvas 重建属于 CPU 问题，碰撞体影响的是物理线程。追问：如何用 Scene 视图的 Overdraw 模式或 Frame Debugger 量化层数。",
  "tags": [
   "Overdraw",
   "填充率",
   "GPU"
  ]
 },
 {
  "id": "perf-15",
  "cat": "perf",
  "level": "进阶",
  "type": "judge",
  "q": "判断：粒子系统的每个粒子都会产生一次 Draw Call，所以粒子数量越多 Draw Call 一定越高。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "粒子按材质/贴图合批，一个 ParticleSystem 通常只有 1 到几个 Draw Call，粒子数量主要影响顶点处理、填充率和 CPU 端模拟开销，而不是线性增加 Draw Call。真正拉高 Draw Call 的是不同材质、子发射器、Trail/碰撞模块等。追问：如何判断粒子瓶颈在 CPU 模拟还是 GPU Overdraw。",
  "tags": [
   "粒子系统",
   "DrawCall",
   "性能"
  ]
 },
 {
  "id": "perf-16",
  "cat": "perf",
  "level": "高级",
  "type": "single",
  "q": "关于 Job System + Burst，下列说法正确的是？",
  "options": [
   "Job 中不能直接访问 Transform、GameObject 等主线程 API，需要把数据放进 NativeArray，在主线程 Complete 后回写",
   "Job 里可以随意 new class、访问静态托管对象",
   "Burst 编译后会自动把任意 C# 代码并行化",
   "Job 一旦 Schedule 就立即在后台完成，不需要 Complete"
  ],
  "answer": [
   0
  ],
  "explain": "Job 运行在 worker 线程，只能使用 blittable 数据与 NativeContainer，托管对象、Unity 主线程 API、静态托管状态都不可访问，结果要在主线程 Complete 后写回。Burst 只加速被它编译的 job 代码，不会把普通 C# 自动并行化。Schedule 只是入队，Complete 太早会丧失并行收益，太晚则造成主线程等待。追问：Temp、TempJob、Persistent 三种 NativeArray 分配器的生命周期与释放责任。",
  "tags": [
   "JobSystem",
   "Burst",
   "多线程"
  ]
 },
 {
  "id": "perf-17",
  "cat": "perf",
  "level": "高级",
  "type": "multi",
  "q": "以下哪些是 GC 友好的写法？（多选）",
  "options": [
   "Physics.RaycastNonAlloc(ray, results, dist, mask) 复用结果数组",
   "用 dict.TryGetValue(key, out var value) 代替 ContainsKey 加索引器",
   "循环里用 StringBuilder 代替 string += 拼接",
   "每帧调用 GetComponents<Collider>() 获取新数组"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "NonAlloc 系列把结果写进调用方提供的数组，避免每次查询分配；TryGetValue 一次哈希查找完成判断与取值，ContainsKey 加索引器要做两次；StringBuilder 复用内部缓冲，避免字符串反复复制带来的 O(n²) 分配。GetComponents 每次返回新数组，应改用带 List<T> 参数的重载或缓存结果。追问：Unity 2021+ 对 Span/ArrayPool 的支持情况与使用限制。",
  "tags": [
   "NonAlloc",
   "TryGetValue",
   "StringBuilder"
  ]
 },
 {
  "id": "perf-18",
  "cat": "perf",
  "level": "高级",
  "type": "single",
  "q": "手机长时间游戏后发热降频，帧率从 60 掉到 40。以下应对策略最合理的是？",
  "options": [
   "动态降低渲染分辨率与画质档位，并限制目标帧率（如 30/45），用 Adaptive Performance 或自研分级策略随温度调整",
   "把 targetFrameRate 设为 120，让手机更快渲染完",
   "关闭 vsync 并固定 60 帧，发热问题就会消失",
   "把所有材质换成 Standard 着色器以提升稳定性"
  ],
  "answer": [
   0
  ],
  "explain": "发热降频是 SoC 的热保护行为，只能通过降低持续负载解决：分辨率缩放、阴影/后处理降级、LOD、限制帧率都会直接减少 GPU/CPU 功耗。把帧率目标调高只会更热；固定 60 帧不改变单位时间的工作量；Standard 着色器更重而不是更轻。工程上要按机型分档并做 30 分钟以上的稳定性测试。追问：如何定义性能预算（如中端机 30 FPS、GPU 帧耗时 ≤ 12ms）。",
  "tags": [
   "移动端",
   "发热降频",
   "画质分级"
  ]
 },
 {
  "id": "perf-19",
  "cat": "perf",
  "level": "高级",
  "type": "judge",
  "q": "判断：在 Android 真机上抓取 Unity Profiler 数据需要 Development Build 并勾选 Autoconnect Profiler；iOS 侧还可以用 Xcode Instruments 做 CPU/GPU 的深度分析。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "Unity Profiler 连接真机依赖 Development Build 提供的调试与 profiler 支持，Autoconnect Profiler 省去手动填 IP；Android 还可用 adb logcat、dumpsys gfxinfo、top 辅助定位。iOS 用 Instruments 的 Time Profiler、Metal System Trace 能看到 Unity Profiler 覆盖不到的系统级开销。追问：Release 包为什么连不上 Profiler（未开 Development Build、profiler 标记被剥离）。",
  "tags": [
   "真机测试",
   "ADB",
   "Instruments"
  ]
 },
 {
  "id": "perf-20",
  "cat": "perf",
  "level": "高级",
  "type": "multi",
  "q": "以下哪些是造成“间歇性卡顿”的典型代码或做法？（多选）",
  "options": [
   "在 Update 中调用 GameObject.Find 或 Camera.main 查找对象",
   "每帧调用 GetComponent<T>() 获取组件",
   "每帧修改 LayoutGroup、频繁 SetActive 触发 UI 重建",
   "在 Awake 中缓存 Transform 引用"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "GameObject.Find 会遍历场景层级，Camera.main 内部按 MainCamera tag 查找（新版本有缓存但仍有属性与查找开销），GetComponent 每次都要走原生到托管的调用；每帧触发 UI 重建会造成周期性耗时尖峰。Awake 缓存引用正是标准优化做法，不属于卡顿来源。追问：如何用 Profiler 的 Hierarchy 视图把尖峰定位到具体方法。",
  "tags": [
   "Find",
   "GetComponent",
   "卡顿"
  ]
 },
 {
  "id": "asset-01",
  "cat": "asset",
  "level": "基础",
  "type": "single",
  "q": "新项目需要支持资源热更和按需加载，团队不想从零自建打包管线。下列资源管理方案选型最合理的是？",
  "options": [
   "全部放 Resources 目录，API 简单、随包发布，靠替换安装包更新",
   "直接用原生 AssetBundle，自己实现依赖收集、版本管理、下载和卸载",
   "使用 Addressables，它在 AssetBundle 之上封装了 Group、Label、Remote 加载和引用计数",
   "把资源原样放进 StreamingAssets，运行时用 File.ReadAllBytes 读取后自己解析"
  ],
  "answer": [
   2
  ],
  "explain": "Resources 目录的资源会在打包时全量进包，且无法热更，启动时还要构建资源索引，只适合极小量的常驻资源。原生 AssetBundle 能力足够，但依赖收集、冗余检查、版本清单、下载校验、引用计数都要自己写，工程成本高。Addressables 是官方在 AB 之上的封装，提供 Group/Label/Remote 与 AsyncOperationHandle 引用计数，适合需要热更的中大型项目。StreamingAssets 只适合放原始文件，不具备资源导入、依赖和类型管理能力。追问：Addressables 底层仍是 AB，出现包体冗余时怎么排查？",
  "tags": [
   "Addressables",
   "AssetBundle",
   "Resources",
   "资源热更"
  ]
 },
 {
  "id": "asset-02",
  "cat": "asset",
  "level": "基础",
  "type": "judge",
  "q": "Resources.Load 加载贴图时需要写完整扩展名，例如 Resources.Load<Sprite>(\"UI/icon.png\")。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Resources.Load 的路径是相对 Resources 文件夹、且不带扩展名的，正确写法是 Resources.Load<Sprite>(\"UI/icon\")，带上 .png 会直接找不到资源。同一路径下如果存在多个不同类型的同名资源，加载时还会出现类型歧义，所以 Resources 目录要避免同名文件。另外 Resources 里的资源无法热更且会拖慢启动，正式项目通常只保留极少量启动必需资源。追问：Resources.UnloadUnusedAssets 应该在什么时机调用，它为什么会造成卡顿？",
  "tags": [
   "Resources",
   "资源加载",
   "卸载"
  ]
 },
 {
  "id": "asset-03",
  "cat": "asset",
  "level": "基础",
  "type": "single",
  "q": "关于 AssetBundle.Unload(true) 与 Unload(false)，下列说法正确的是？",
  "options": [
   "true 只卸载 AB 文件镜像，已加载的 Asset 继续保留；false 会连 Asset 一起销毁",
   "true 会销毁从该 AB 加载出的所有 Asset 实例，包括场景中仍在引用的对象；false 只释放 AB 自身镜像，Asset 仍由引用持有，需要之后再主动回收",
   "两者没有本质区别，只是 true 执行更快",
   "false 会立即释放全部内存，true 会延迟到下一帧才释放"
  ],
  "answer": [
   1
  ],
  "explain": "AssetBundle 是资源容器，Unload(true) 在卸载容器的同时销毁由它加载出来的 Asset，场景里正在使用的贴图、材质会变成 Missing，这是典型线上事故来源。Unload(false) 只释放 AB 自身（头部与文件镜像），已实例化的 Asset 仍留在内存，必须保证没有引用后再用 Resources.UnloadUnusedAssets 或框架的引用计数回收。实际项目多采用 false 加引用计数，只有确定该包资源全部无用（例如整包卸载某个活动）时才用 true。追问：如何定位一张贴图为什么卸载不掉？",
  "tags": [
   "AssetBundle",
   "Unload",
   "引用计数",
   "内存"
  ]
 },
 {
  "id": "asset-04",
  "cat": "asset",
  "level": "基础",
  "type": "single",
  "q": "Android 真机上，热更下载的资源需要持久化保存并在下次启动继续使用，应该写到哪个目录？",
  "options": [
   "Application.dataPath",
   "Application.streamingAssetsPath",
   "Application.persistentDataPath",
   "Application.temporaryCachePath"
  ],
  "answer": [
   2
  ],
  "explain": "dataPath 指向安装包内部（Android 上是 apk 内的资源视图），只读，不能写入。streamingAssetsPath 在 Android 上位于 apk 内（jar:file://），同样只读，而且必须用 UnityWebRequest 而不是 File API 读取。persistentDataPath 可读写、只有卸载应用才会清除，是热更资源落盘的唯一正确选择。temporaryCachePath 可能被系统在空间不足时清理，只适合放可重新下载的缓存。追问：iOS 与 WebGL 上这些路径分别有什么差异？",
  "tags": [
   "persistentDataPath",
   "StreamingAssets",
   "热更新",
   "平台差异"
  ]
 },
 {
  "id": "asset-05",
  "cat": "asset",
  "level": "基础",
  "type": "multi",
  "q": "以下哪些纹理导入设置有助于降低包体或运行内存？",
  "options": [
   "非必要不勾选 Read/Write，避免在内存中保留一份可读写副本",
   "UI 图集贴图关闭 Mipmap，避免生成用不到的多级纹理",
   "Android 上优先使用 ASTC/ETC2 压缩格式，而不是 RGBA32 未压缩格式",
   "把所有贴图的 Max Size 都调到 8192 以保证清晰度"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Read/Write 开启后 CPU 侧会常驻一份纹理数据，内存直接翻倍，只有需要 GetPixels/SetPixels 或从纹理读数据时才应开启。Mipmap 会让纹理内存增加约三分之一，UI 和始终近距离显示的贴图通常不需要。ASTC/ETC2 是移动端硬件压缩格式，显存占用远低于 RGBA32，但要注意机型覆盖和 alpha 通道需求。把 Max Size 全部调大恰恰会显著增加内存和包体，应按实际显示尺寸设置。追问：ASTC 的块大小怎么选，Crunch 压缩适合什么场景？",
  "tags": [
   "纹理导入",
   "纹理压缩",
   "Mipmap",
   "包体优化"
  ]
 },
 {
  "id": "asset-06",
  "cat": "asset",
  "level": "基础",
  "type": "judge",
  "q": "AssetBundle.LoadFromMemory 比 LoadFromFile 更省内存，因为它不需要把文件读进内存。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "LoadFromMemory 要求调用方先把整个 AB 的字节数组读进内存，Unity 内部还要再解压解析一份，峰值内存约等于原始字节加解压后的镜像，大包时非常危险。LoadFromFile 直接对文件做内存映射，内存占用低、加载也更快，是本地 AB 的首选。只有在 AB 已经以字节形式存在于内存中（例如网络下载后不落盘）时才考虑 LoadFromMemory。追问：LZ4 与 LZMA 压缩对加载速度和内存峰值的影响有什么不同？",
  "tags": [
   "AssetBundle",
   "LoadFromMemory",
   "LoadFromFile",
   "内存"
  ]
 },
 {
  "id": "asset-07",
  "cat": "asset",
  "level": "进阶",
  "type": "single",
  "q": "项目有约 2000 个 Prefab，大量共享材质、图集和 Shader。下列 AssetBundle 打包策略最合理的是？",
  "options": [
   "每个 Prefab 单独打一个 AB，加载最灵活",
   "按目录结构一个目录打一个 AB，不再做其它处理",
   "按逻辑分组（UI/角色/场景/特效等），把公共依赖抽成独立 AB 并让业务包依赖它，同时用依赖分析控制粒度与冗余",
   "全部打成一个 AB，彻底避免依赖问题"
  ],
  "answer": [
   2
  ],
  "explain": "每个 Prefab 一个包会产生大量小文件，依赖关系爆炸，加载时 IO 和句柄管理成本极高。纯按目录打包会把逻辑上无关的资源绑在一起，更新粒度粗，而且公共依赖没有单独抽包时仍会重复。全打一个包虽然没依赖问题，但无法按需加载、内存峰值高、任何小改动都要整包更新。正确做法是按逻辑分组、公共依赖抽包，并用 AssetDatabase.GetDependencies 或构建报告检查冗余。追问：循环依赖会带来什么问题，怎么打破？",
  "tags": [
   "AssetBundle",
   "打包策略",
   "依赖管理",
   "资源冗余"
  ]
 },
 {
  "id": "asset-08",
  "cat": "asset",
  "level": "进阶",
  "type": "single",
  "q": "使用原生 AssetBundle 时，要在加载某个业务包之前先加载它的依赖包。依赖关系应该从哪里获取？",
  "code": "var manifestAB = AssetBundle.LoadFromFile(Path.Combine(root, platformName));\nvar manifest = manifestAB.LoadAsset<AssetBundleManifest>(\"AssetBundleManifest\");\nstring[] deps = manifest.GetAllDependencies(\"ui/login\");",
  "options": [
   "每个 AB 旁边的同名 .manifest 文本文件，运行时直接读取",
   "打包输出的 AssetBundleManifest（平台主包），用 GetAllDependencies 查询后按依赖顺序加载",
   "Unity 会在加载业务包时自动递归加载依赖，不需要额外处理",
   "依赖关系记录在 Editor.log 中，运行时解析日志"
  ],
  "answer": [
   1
  ],
  "explain": "每个 AB 同名的 .manifest 是给人看和 Editor 使用的文本，运行时读取不可靠也不高效。真正的依赖表在打包根目录生成的 AssetBundleManifest 里，通常打成一个以平台名命名的 AB（如 Android），先加载它再取出 AssetBundleManifest 资源。拿到依赖数组后要按拓扑顺序（先依赖、后自身）加载，否则会出现资源丢失或材质变紫。Addressables 则用 catalog 记录 location 与依赖，思路一致。追问：依赖包没加载就加载业务包，运行时会看到什么现象？",
  "tags": [
   "AssetBundle",
   "AssetBundleManifest",
   "依赖管理",
   "主包"
  ]
 },
 {
  "id": "asset-09",
  "cat": "asset",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些情况会造成 AssetBundle 冗余（同一资源被重复打进多个包）？",
  "options": [
   "两个业务 AB 都直接引用了同一张没有单独成包的贴图",
   "图集 A 中的 Sprite 与图集 B 中的 Sprite 相互引用，导致两个图集包互相包含",
   "材质引用了某个 Shader，而 Shader 没有单独打包，于是每个引用它的材质包都各带一份",
   "把公共材质单独打成一个 AB，业务包只通过依赖引用它"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "冗余的本质是同一个 Asset 被多个 AB 包含，运行时这些包同时加载，内存里就会有多份实例。公共资源（Shader、共享材质、字体、通用图集）体积大、引用广，是冗余重灾区，必须单独抽包。第四项恰恰是消除冗余的标准手段，不会造成冗余。排查可以用 AssetBundle Browser 的冗余视图，或自建依赖分析脚本在打包前拦截。追问：Shader 变体爆炸和 AB 冗余是同一类问题吗？",
  "tags": [
   "资源冗余",
   "依赖管理",
   "Shader",
   "图集"
  ]
 },
 {
  "id": "asset-10",
  "cat": "asset",
  "level": "进阶",
  "type": "single",
  "q": "用 Addressables.LoadAssetAsync 加载一个 Prefab 并实例化到场景后，正确的释放方式是？",
  "options": [
   "实例化后调用 Resources.UnloadUnusedAssets() 即可",
   "保存 LoadAssetAsync 返回的 AsyncOperationHandle，不再使用时调用 Addressables.Release(handle)；若是 InstantiateAsync 创建的实例则用 ReleaseInstance",
   "调用 Object.Destroy 销毁实例后，资源会自动释放",
   "不需要释放，Addressables 会在切场景时自动回收所有资源"
  ],
  "answer": [
   1
  ],
  "explain": "LoadAssetAsync 返回的 handle 会对 bundle 和 asset 分别做引用计数，Release 让计数减一，归零后才真正卸载。Object.Destroy 只销毁场景实例，不会减少 Addressables 的计数，不 Release 就是典型泄漏。多个系统加载同一资源时计数会叠加，必须每个 handle 都配对释放。切场景并不会自动回收，除非显式清理或使用带作用域的封装。追问：如何用 Addressables Event Viewer 或 Memory Profiler 验证资源确实释放了？",
  "tags": [
   "Addressables",
   "引用计数",
   "资源泄漏",
   "AsyncOperationHandle"
  ]
 },
 {
  "id": "asset-11",
  "cat": "asset",
  "level": "进阶",
  "type": "judge",
  "q": "Addressables 的 Label 可以把一批资源标记在一起，用 LoadAssetsAsync 按 Label 批量加载，并对返回的 handle 统一释放。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "Label 是运行时的逻辑筛选标签，一个 asset 可以属于多个 Label，按标签加载一批资源时会返回一个合并的 handle，释放它即可释放整批。它适合做预加载、分类加载和资源规约。但 Label 滥用会让一次加载意外拉入大量资源，通常要配合 Group 控制打包方式与加载模式。追问：Label 和 Group 的职责区别是什么？",
  "tags": [
   "Addressables",
   "Label",
   "批量加载",
   "Group"
  ]
 },
 {
  "id": "asset-12",
  "cat": "asset",
  "level": "进阶",
  "type": "single",
  "q": "资源热更新的完整流程，正确的顺序是？",
  "options": [
   "直接下载全部远端资源覆盖本地，然后重启游戏",
   "请求版本号 → 拉取远端清单 → 与本地清单比对出差异 → 差异下载（支持断点续传）→ 校验大小与哈希 → 写入本地并更新版本记录 → 通知框架重载生效",
   "先删除本地旧资源，再全量下载，最后校验",
   "下载资源 → 校验 → 对比版本 → 生效"
  ],
  "answer": [
   1
  ],
  "explain": "顺序的关键是先用版本号和清单确定要下什么，再做文件粒度的差异下载，避免全量流量。校验必须在下完之后、生效之前，否则网络中断或 CDN 返回错误页会把坏文件写进本地。落盘要先写临时文件再原子替换，最后更新版本记录，保证中途崩溃后下次能续传或重试。全量覆盖和先删后下都会放大失败成本。追问：强更和弱更怎么区分，灰度发布与回滚怎么做？",
  "tags": [
   "热更新",
   "版本管理",
   "清单",
   "CDN"
  ]
 },
 {
  "id": "asset-13",
  "cat": "asset",
  "level": "进阶",
  "type": "single",
  "q": "关于 AssetBundle 的同步与异步加载，下列说法正确的是？",
  "options": [
   "同步加载一定比异步快，项目应统一使用同步加载",
   "异步加载（LoadFromFileAsync/LoadAssetAsync）把工作分摊到多帧、不阻塞主线程，适合大包和切场景，但需要处理回调时序、并发去重和加载队列",
   "异步加载只能用回调，不能配合协程",
   "异步加载完成后资源已经自动实例化到场景中"
  ],
  "answer": [
   1
  ],
  "explain": "同步加载会阻塞主线程，包越大卡顿越明显，在战斗或切场景时尤其致命。异步加载把 IO 和解压分摊到多帧，但引入时序复杂度：同一资源可能被多处同时请求，需要合并请求或缓存 handle，还要用加载队列控制优先级和并发上限。异步完成只代表资源可用，实例化仍要自己做。追问：如何做一个带优先级和并发上限的加载队列，假进度条怎么设计？",
  "tags": [
   "异步加载",
   "同步加载",
   "协程",
   "加载队列"
  ]
 },
 {
  "id": "asset-14",
  "cat": "asset",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些属于有效的包体/首包优化手段？",
  "options": [
   "首包只保留启动必需资源，其余资源放远端按需下载",
   "用依赖分析剔除未被引用的资源，并关闭不用的引擎模块、开启代码裁剪",
   "音频统一使用未压缩 PCM WAV，保证音质",
   "合并图集减少重复贴图，纹理按平台使用 ASTC/ETC2 并合理降低 Max Size"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "首包裁剪是最直接的手段，把非启动必需资源移到远端或按需下载能显著减小安装包。未引用资源、冗余 Shader、未使用的引擎模块和托管代码都可以通过构建报告与裁剪选项去掉。PCM WAV 体积巨大，长音频应使用 Vorbis/MP3 并考虑流式加载，短音效可用 ADPCM，这才是正确做法。图集合并与平台压缩格式同时影响包体和运行内存。追问：怎么量化优化效果，Build Report 里重点看什么？",
  "tags": [
   "包体优化",
   "首包裁剪",
   "图集",
   "音频压缩"
  ]
 },
 {
  "id": "asset-15",
  "cat": "asset",
  "level": "进阶",
  "type": "single",
  "q": "玩家反复进出战斗场景后，Profiler 显示 Texture 与 AssetBundle 内存持续上涨，最可能的原因和排查方向是？",
  "options": [
   "Unity 存在内存泄漏 bug，只能升级引擎或重启进程",
   "加载与释放没有配对：AB 或 Addressables handle 未 Release、实例未 Destroy、静态字段/事件/协程仍持有引用；用 Memory Profiler 对比两次快照定位未释放对象",
   "一定是 GC 没有触发，手动调用 GC.Collect 就能解决",
   "是图集太大，把图集全部拆小即可"
  ],
  "answer": [
   1
  ],
  "explain": "引用计数型资源框架里，只要还有一处没有 Release，计数就不会归零，bundle 和 asset 都无法卸载，表现为每次进战斗都涨一截。除了 handle，静态字段、事件订阅、闭包和协程也会长期持有 UnityEngine.Object 引用。GC.Collect 无法回收仍被引用的对象，所以手动 GC 通常没用。正确做法是用 Memory Profiler 抓取进出场景前后的快照做 diff，再顺着引用链找到持有者。追问：如何用加载作用域（scope）从架构上避免漏 Release？",
  "tags": [
   "引用计数",
   "内存泄漏",
   "Memory Profiler",
   "资源释放"
  ]
 },
 {
  "id": "asset-16",
  "cat": "asset",
  "level": "高级",
  "type": "single",
  "q": "HybridCLR 能在 IL2CPP 下实现 C# 代码热更，其核心原理是？",
  "options": [
   "把 C# 逻辑翻译成 Lua 脚本执行",
   "扩展 IL2CPP 运行时，让热更程序集以解释执行方式运行，并补充 AOT 泛型元数据，使热更 DLL 中的类型和泛型实例可用",
   "在 iOS 上动态生成机器码实现 JIT",
   "把热更代码编译成 ScriptableObject 资源加载"
  ],
  "answer": [
   1
  ],
  "explain": "iOS 禁止 JIT，IL2CPP 又是全 AOT，所以不能像 Mono 那样 Assembly.Load 后即时编译。HybridCLR 给 IL2CPP 运行时加了一个 IL 解释器，热更 DLL 以解释方式执行，同时通过补充 AOT 泛型元数据解决热更代码引用未在 AOT 中实例化的泛型时报错。xLua/toLua 走 Lua 绑定路线，ILRuntime 是独立的 IL 解释器加 CLR 重定向，三者原理和生态不同。追问：AOT 泛型缺失具体在什么情况下报错，补充元数据的流程是怎样的？",
  "tags": [
   "HybridCLR",
   "IL2CPP",
   "AOT泛型",
   "代码热更"
  ]
 },
 {
  "id": "asset-17",
  "cat": "asset",
  "level": "高级",
  "type": "single",
  "q": "关于 iOS 平台的代码热更，下列说法正确的是？",
  "options": [
   "iOS 允许 JIT，所以可以直接用 Assembly.Load 加载新 DLL 并执行",
   "iOS 禁止 JIT、IL2CPP 全 AOT，不能动态加载并即时编译新代码；只能采用解释执行方案（HybridCLR/ILRuntime/xLua）或只做资源热更，同时要评估审核合规性",
   "只要把 DLL 打进 AssetBundle，iOS 就能像 Android Mono 一样直接加载执行",
   "IL2CPP 支持运行时反射创建任意泛型类型，因此不存在 AOT 限制"
  ],
  "answer": [
   1
  ],
  "explain": "IL2CPP 下没有 JIT，Assembly.Load 加载的程序集无法被编译执行，动态程序集也基本不可用。所以代码热更只能靠解释器方案，把热更逻辑以 IL 或 Lua 的形式解释执行，代价是性能低于原生 AOT，且要处理 AOT 泛型与代码裁剪（link.xml）问题。纯资源热更不涉及执行新代码，没有这层限制。审核层面对动态下发可执行代码有额外要求，需要结合发行地区评估。追问：Android 上 Mono 与 IL2CPP 的热更能力差异在哪里？",
  "tags": [
   "iOS",
   "IL2CPP",
   "代码热更",
   "AOT"
  ]
 },
 {
  "id": "asset-18",
  "cat": "asset",
  "level": "高级",
  "type": "multi",
  "q": "设计一个资源热更下载器，以下哪些是必要或推荐的做法？",
  "options": [
   "先拉取文件清单，按文件粒度做差异比对，只下载有变化的文件",
   "支持断点续传（HTTP Range 加记录本地已下载偏移）、失败重试与超时、并发数与限速控制",
   "下载完成后校验大小和 MD5/SHA1，失败重下；先写临时文件再原子替换，避免产生半包",
   "把所有文件打成一个超大 zip，一次性下载完再整体解压，且不做校验"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "文件级差异能把更新流量降到最小，是热更的基本盘。断点续传依赖服务端支持 Range 请求，客户端要记录偏移并在重试时续传；并发与限速则避免打满玩家带宽、影响游戏内网络。校验和原子替换保证不会出现下载到一半崩溃、本地资源损坏的情况，版本文件最后更新才能保持一致。大 zip 无法增量更新，失败代价高，不校验则可能把 CDN 错误页当成资源写盘。追问：边下边玩、下载优先级和 CDN 多域名容灾怎么设计？",
  "tags": [
   "热更新",
   "断点续传",
   "下载器",
   "CDN"
  ]
 },
 {
  "id": "asset-19",
  "cat": "asset",
  "level": "高级",
  "type": "judge",
  "q": "代码热更和资源热更能互相替代：只要资源可以热更，就不需要代码热更。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "资源热更更新的是 AssetBundle/Addressables 里的 Prefab、贴图、配置和数值，它无法改变已经编译进安装包的 C# 逻辑。代码热更需要解释执行方案（HybridCLR/ILRuntime/xLua）才能下发并执行新逻辑，两者解决的问题不同，通常配合使用：策划数值和活动配置走资源热更，紧急逻辑修复走代码热更。代码热更还有平台限制（iOS 审核、AOT 泛型）和性能成本，不能无脑全量使用。追问：哪些逻辑适合放 Lua，哪些必须留在 C#？",
  "tags": [
   "代码热更",
   "资源热更",
   "xLua",
   "发布流程"
  ]
 },
 {
  "id": "asset-20",
  "cat": "asset",
  "level": "高级",
  "type": "single",
  "q": "关于多平台打包以及 Editor 与真机的资源路径差异，下列说法正确的是？",
  "options": [
   "Editor 下可以用 AssetDatabase.LoadAssetAtPath 读取任意资源，真机没有 AssetDatabase，必须走 AssetBundle/Addressables 或 Resources",
   "AssetBundle 与平台无关，Windows 打出来的包可以直接给 Android 用",
   "StreamingAssets 在所有平台都能用 File.ReadAllBytes 直接读取",
   "persistentDataPath 在 Editor 下就是项目的 Assets 目录"
  ],
  "answer": [
   0
  ],
  "explain": "AssetDatabase 只在 Editor 可用，所以仅在编辑器里直接读资源的代码到真机必然失效，正式流程要么走 AB/Addressables，要么把少量资源放 Resources。AB 与平台强相关：纹理压缩格式、Shader 变体、字节序都不同，必须按平台分别打包并维护各自的清单。Android 的 StreamingAssets 在 apk 内，只能用 UnityWebRequest 读取；persistentDataPath 在 Editor 下是系统按公司名/产品名生成的目录，不是 Assets。追问：多平台一键打包时，宏定义、资源变体和清单隔离怎么做？",
  "tags": [
   "多平台打包",
   "AssetDatabase",
   "StreamingAssets",
   "persistentDataPath"
  ]
 },
 {
  "id": "net-01",
  "cat": "net",
  "level": "基础",
  "type": "single",
  "q": "一款 5v5 实时对战游戏，对操作延迟非常敏感，传输层方案最合理的是？",
  "options": [
   "直接用 TCP，保证数据可靠且有序",
   "用 UDP，并在其上自研可靠层（KCP/ENet/QUIC 之类），只对关键数据做重传和排序",
   "用 HTTP 短轮询，简单可靠",
   "用 FTP 传输战斗数据"
  ],
  "answer": [
   1
  ],
  "explain": "TCP 的可靠有序恰恰是实时对战的问题：一旦丢包，后续所有数据都会被队头阻塞，重传延迟直接叠加到操作上。UDP 本身不保证到达和顺序，但可以把过期就无意义的状态帧直接丢弃，只对关键事件做重传，从而把延迟压到最低。HTTP 轮询每次都带完整请求开销且延迟高，FTP 更不是实时协议。实际项目常用 KCP/QUIC 这类可靠 UDP，或在 UDP 上自研协议。追问：什么类型的游戏反而适合用 TCP？",
  "tags": [
   "TCP",
   "UDP",
   "KCP",
   "传输层"
  ]
 },
 {
  "id": "net-02",
  "cat": "net",
  "level": "基础",
  "type": "single",
  "q": "TCP 出现粘包/拆包现象的根本原因是？",
  "options": [
   "TCP 会丢包，丢包后重传导致数据错位",
   "TCP 是面向字节流的协议，不保留应用层消息边界，发送端多次 write 可能被合并，接收端一次 read 也可能只拿到半条消息",
   "网卡接收缓冲区太小",
   "没有开启 TCP_NODELAY"
  ],
  "answer": [
   1
  ],
  "explain": "TCP 只保证字节流按序到达，它不知道应用层一条消息从哪里开始到哪里结束，所以合并与拆分都是正常现象，不是错误。Nagle 算法和缓冲区大小只会影响合并的频率，关掉 NODELAY 也解决不了边界问题。解决办法是在应用层定义帧格式：长度前缀、分隔符或定长消息，接收端缓冲后循环解析。UDP 是数据报协议天然有边界，但超过 MTU 会被 IP 分片。追问：有了长度前缀，为什么还要限制单条消息的最大长度？",
  "tags": [
   "TCP",
   "粘包",
   "字节流",
   "帧格式"
  ]
 },
 {
  "id": "net-03",
  "cat": "net",
  "level": "基础",
  "type": "judge",
  "q": "只要开启 TCP_NODELAY 关闭 Nagle 算法，就不会再出现粘包。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "Nagle 只是把小包合并发送以减少网络上的小包数量，关闭它能让数据更快发出，但不会给字节流加上消息边界。接收端的 read 依然可能只读到半条消息，或者一次读到多条消息，粘包/拆包照旧存在。必须在应用层用长度前缀或分隔符做帧解析。追问：Nagle 和延迟 ACK 同时开启时，为什么会出现额外几十毫秒的延迟？",
  "tags": [
   "TCP",
   "Nagle",
   "粘包",
   "延迟"
  ]
 },
 {
  "id": "net-04",
  "cat": "net",
  "level": "基础",
  "type": "single",
  "q": "长连接中心跳包的主要作用是？",
  "options": [
   "承载业务数据，减少包数量",
   "探测连接是否仍然可用，防止 NAT/防火墙/负载均衡因空闲超时静默断开，并及时发现半开连接",
   "对传输数据做加密",
   "提升带宽利用率"
  ],
  "answer": [
   1
  ],
  "explain": "TCP 连接在中间设备上通常有空闲超时，超时后连接会被静默丢弃，双方都以为还连着，这就是半开连接。定期心跳加超时判定能及时发现并触发重连，也能顺带测量 RTT。心跳间隔要小于链路上最短的空闲超时（常见 NAT 是几十秒到几分钟），实际项目常取 5~15 秒。心跳包应当很小，且不能被业务消息阻塞。追问：应用层心跳和 TCP KeepAlive 有什么区别，为什么后者通常不够用？",
  "tags": [
   "心跳",
   "超时",
   "长连接",
   "NAT"
  ]
 },
 {
  "id": "net-05",
  "cat": "net",
  "level": "基础",
  "type": "judge",
  "q": "WebSocket 在 HTTP Upgrade 握手后建立全双工长连接，服务端可以主动推送，适合大厅、聊天和回合制玩法。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "握手阶段复用 HTTP 的 101 Switching Protocols，之后双方都可以随时发帧，帧头只有几个字节，比长轮询每次带完整 HTTP 头高效得多。它解决了服务端主动推送和低开销的问题，但底层仍然是 TCP，丢包时同样有队头阻塞，所以不适合对延迟极敏感的实时对战。追问：wss 以及 Nginx 反向代理下 WebSocket 的粘包与超时配置要注意什么？",
  "tags": [
   "WebSocket",
   "长连接",
   "全双工",
   "HTTP"
  ]
 },
 {
  "id": "net-06",
  "cat": "net",
  "level": "进阶",
  "type": "single",
  "q": "下面是长度前缀协议的收包代码，注释处应补充的关键逻辑是？",
  "code": "// 接收缓冲区 buf 中已有 n 字节\nwhile (true) {\n    if (n < 4) break;                 // 长度字段都不完整\n    int len = ReadInt32LE(buf, 0);\n    if (len <= 0 || len > MAX_BODY) throw ...;\n    if (n < 4 + len) break;           // 消息体不完整\n    Dispatch(buf, 4, len);\n    // ____\n}",
  "options": [
   "直接 return，等下一次 recv 再从缓冲区头部重新开始",
   "从缓冲区移除已消费的 4+len 字节，n 减去对应长度，然后继续循环处理剩余数据",
   "把整个缓冲区清空，丢弃剩余字节",
   "把 len 重置为 0 后继续"
  ],
  "answer": [
   1
  ],
  "explain": "一次 recv 可能拿到半条消息，也可能拿到三条半消息，所以必须用可增长的接收缓冲区配合循环解析：不够就等下一批数据，够了就取出一条并从缓冲区头部移除，再继续处理剩下的字节。只 break 不消费会让同一条消息被反复解析，直接清空则会丢掉已经到达的后续完整消息。实现上要注意长度字段的字节序，并限制最大长度防止恶意超大包撑爆内存。追问：如何减少这里的 GC，用什么数据结构替代 byte[] 反复拼接？",
  "tags": [
   "粘包",
   "长度前缀",
   "收包缓冲区",
   "协议解析"
  ]
 },
 {
  "id": "net-07",
  "cat": "net",
  "level": "进阶",
  "type": "single",
  "q": "MMO 战斗同步每秒 20 帧，单条协议字段较多，且客户端、服务端和运营工具需要跨语言，序列化方案最合适的是？",
  "options": [
   "JSON，可读性好、调试方便",
   "Protobuf 之类的二进制 schema 方案，体积小、解析快、跨语言，热路径还可以再用手写二进制优化",
   "XML，结构清晰",
   "直接用 C# BinaryFormatter 序列化对象"
  ],
  "answer": [
   1
  ],
  "explain": "JSON/XML 是文本格式，字段名重复传输、解析要扫描字符串并产生大量临时对象，高频同步时 CPU 和 GC 压力都很大。BinaryFormatter 体积不小、版本兼容差且有反序列化安全漏洞，已被官方弃用，不能用于网络协议。Protobuf 用字段编号和 varint 编码，体积小、解析快，.proto 天然支持多语言和协议演进，代价是要维护 schema 和代码生成。对高频协议这点成本是值得的。追问：Protobuf 新增或删除字段时怎么保证前后兼容？",
  "tags": [
   "Protobuf",
   "序列化",
   "带宽",
   "协议设计"
  ]
 },
 {
  "id": "net-08",
  "cat": "net",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些是帧同步（Lockstep）的典型特征或要求？",
  "options": [
   "只同步玩家的操作指令，各客户端用相同逻辑本地推演，带宽小且天然支持回放",
   "要求逻辑层确定性：定点数、固定随机种子、稳定的容器遍历顺序",
   "服务器每帧下发完整世界状态，客户端只负责表现",
   "客户端只要收到部分玩家的操作就可以先推进，缺失的靠插值补齐"
  ],
  "answer": [
   0,
   1
  ],
  "explain": "帧同步的核心是大家跑同一份逻辑、只交换输入，所以带宽随玩家数增长但数据量很小，录制输入就能完整回放。代价是必须保证确定性，否则几帧之后世界就分叉了，因此要用定点数、固定随机种子和稳定的遍历顺序。第三项是状态同步的做法；第四项错误，帧同步必须集齐同一帧所有玩家的输入才能推进，丢包时只能等待或做预测回滚。追问：帧同步怎么做断线重连和追帧？",
  "tags": [
   "帧同步",
   "Lockstep",
   "确定性",
   "回放"
  ]
 },
 {
  "id": "net-09",
  "cat": "net",
  "level": "进阶",
  "type": "single",
  "q": "关于帧同步与状态同步的选型，下列说法正确的是？",
  "options": [
   "帧同步带宽小，所以所有类型的游戏都应该用帧同步",
   "RTS/MOBA 这类单位多、指令少、需要回放的游戏适合帧同步；MMO/FPS 这类强调服务器权威、反作弊和大世界兴趣管理的更适合状态同步",
   "状态同步的带宽一定比帧同步小",
   "帧同步不需要服务器，纯 P2P 即可"
  ],
  "answer": [
   1
  ],
  "explain": "帧同步传的是输入，单位再多也不显著增加带宽，而且天然可回放，适合 RTS/MOBA；但它要求确定性，玩家一多、逻辑一复杂就很难保证，反作弊也弱，因为客户端有完整逻辑。状态同步由服务器计算并下发状态，权威、易反作弊、可用 AOI 控制带宽，代价是服务器 CPU 和带宽成本高。实际项目也有混合方案，例如帧同步跑逻辑、服务器做校验和仲裁。追问：状态同步下如何用 AOI 和降频控制大世界带宽？",
  "tags": [
   "帧同步",
   "状态同步",
   "选型",
   "反作弊"
  ]
 },
 {
  "id": "net-10",
  "cat": "net",
  "level": "进阶",
  "type": "single",
  "q": "FPS 中客户端为了手感先本地移动，收到服务器快照后再校正。正确的实现方式是？",
  "options": [
   "收到服务器位置后直接把角色瞬移过去，保证绝对正确",
   "客户端保存输入历史和预测状态，收到服务器快照后回滚到对应时刻、重放尚未确认的输入，再对表现层做平滑，避免抖动",
   "完全相信客户端位置，服务器不做校验",
   "客户端不做预测，等服务器回包后再移动"
  ],
  "answer": [
   1
  ],
  "explain": "不做预测会让操作延迟至少一个 RTT，手感很差；直接瞬移则会出现橡皮筋和画面抖动。标准做法是客户端预测加服务器校正：本地立即响应输入并缓存输入帧，服务器回包时回滚到权威状态、重放未确认输入得到新的预测位置，再把视觉误差用插值平滑掉。服务器始终是权威，校验速度、碰撞和冷却，防止加速类外挂。追问：插值延迟和命中判定的 lag compensation 是怎么配合的？",
  "tags": [
   "客户端预测",
   "回滚重放",
   "延迟补偿",
   "服务器权威"
  ]
 },
 {
  "id": "net-11",
  "cat": "net",
  "level": "进阶",
  "type": "judge",
  "q": "帧同步中只要所有客户端运行同一份代码，浮点运算的结果就一定会完全一致。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "不同 CPU 架构、编译器优化、IL2CPP 与 Mono 的差异、x87 扩展精度以及数学库实现，都可能让 float/double 的结果出现微小差异，单帧看不出来，但累积几千帧后逻辑就会分叉。所以确定性逻辑要用定点数（int/long 加缩放）替代浮点，避免使用平台相关的三角函数和随机数，并固定容器遍历顺序与随机种子。上线后还要用校验和比对来发现不同步。追问：定点数的精度和范围怎么选，和表现层的浮点如何衔接？",
  "tags": [
   "确定性",
   "定点数",
   "浮点误差",
   "帧同步"
  ]
 },
 {
  "id": "net-12",
  "cat": "net",
  "level": "进阶",
  "type": "single",
  "q": "玩家网络抖动断线 30 秒后重新连上，服务端最合理的处理是？",
  "options": [
   "立即销毁角色并踢回登录界面，要求重新登录",
   "保留会话一段时间：校验重连 token、恢复网络订阅与 AOI、补发断线期间的关键状态或让客户端重新拉取快照，超过保留时间才清理",
   "让客户端自己重建整个游戏世界",
   "断线期间继续按原操作模拟，并把所有结果广播给其他玩家"
  ],
  "answer": [
   1
  ],
  "explain": "重连体验的关键是会话保持与状态恢复：服务端要保留角色和会话一小段时间，客户端带 token 重连并做幂等校验（防止重复登录顶号），然后恢复 AOI 订阅并补齐断线期间错过的状态。超过保留时间再清理角色，避免僵尸会话占用资源。让客户端重建世界既不可行也不安全，断线期间继续模拟则会产生玩家已经不在的假状态。追问：大量玩家同时重连（比如服务器重启）时怎么限流和削峰？",
  "tags": [
   "断线重连",
   "会话保持",
   "状态同步",
   "幂等"
  ]
 },
 {
  "id": "net-13",
  "cat": "net",
  "level": "进阶",
  "type": "multi",
  "q": "以下哪些手段可以有效降低实时同步的带宽和开销？",
  "options": [
   "降低同步频率，客户端用插值和有限外推补足表现",
   "只同步变化字段（delta），对坐标和角度做量化与位压缩",
   "用 AOI 只同步玩家周围的实体，远处实体进一步降频",
   "每帧把所有实体的全部属性用 JSON 全量广播，保证一致"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "同步频率和表现质量是一对权衡：降频能省带宽，但要用插值平滑、必要时做短时间外推，代价是引入延迟和误差。增量同步、量化与位压缩能显著减少每帧字节数，但会损失精度，要按玩法设定可接受误差。AOI 加上按距离降频是大世界和 MMO 的标准做法。全量 JSON 广播是典型反例，带宽和 CPU 都撑不住。追问：如何测量实际带宽占用，拥塞时怎么做降级？",
  "tags": [
   "带宽优化",
   "增量同步",
   "量化",
   "AOI"
  ]
 },
 {
  "id": "net-14",
  "cat": "net",
  "level": "高级",
  "type": "single",
  "q": "KCP 相比 TCP 的主要优势在于？",
  "options": [
   "KCP 不需要重传，所以不会丢数据",
   "KCP 在 UDP 之上采用更激进的重传和 ACK 策略（更小的 RTO、可配置 nodelay、选择性重传、可关闭流控），用更多带宽换取更低延迟；但它不解决拥塞公平性，需要自己控制发送速率",
   "KCP 自带加密和 DDoS 防护",
   "KCP 是有连接的可靠协议，和 TCP 一样存在队头阻塞"
  ],
  "answer": [
   1
  ],
  "explain": "TCP 的设计目标是公平和稳定，丢包时会收缩窗口、重传也比较保守，这在实时游戏里表现为延迟尖刺。KCP 把可靠性和拥塞控制拆开：快速重传、ACK 列表、可配置的 nodelay 让它用带宽换延迟，代价是可能挤占其他流量，所以业务层要自己做发送速率控制。它本身不带加密，需要叠加 TLS/DTLS 或自定义加密。QUIC 是另一条路线，在 UDP 上实现可靠传输加多路复用和 TLS 1.3。追问：KCP 的 nodelay/interval/resend 参数怎么调？",
  "tags": [
   "KCP",
   "可靠UDP",
   "重传",
   "延迟"
  ]
 },
 {
  "id": "net-15",
  "cat": "net",
  "level": "高级",
  "type": "single",
  "q": "做延迟补偿和帧同步追帧时，需要估计客户端与服务器的时钟偏移。下列做法最合理的是？",
  "options": [
   "直接使用客户端本地时间作为同步时间轴",
   "多次往返测量：客户端记录发送时刻 t0、服务器回包携带 t1、客户端收到时刻 t2，RTT 等于 t2 减 t0，偏移约为 t1 减 (t0+t2)/2；多次采样取 RTT 最小的样本",
   "用 ping 命令的结果直接当作单向延迟",
   "只要用了 NTP，公网时钟就一定精确到毫秒"
  ],
  "answer": [
   1
  ],
  "explain": "单向延迟无法直接测量，只能假设往返路径近似对称，用 RTT/2 估计单程延迟，再用服务器时间戳减去估计的单程延迟得到偏移。网络排队会污染样本，所以取 RTT 最小的那几次测量，因为它们排队延迟最小、估计最接近真实值。ping 用的是 ICMP，路径和优先级可能与游戏流量不同，NTP 在公网也会受抖动影响，通常只有几毫秒到几十毫秒精度。还要处理时钟漂移，用滑动窗口持续校正。追问：帧同步里服务器时间轴和客户端追帧速度怎么配合？",
  "tags": [
   "时钟同步",
   "RTT",
   "NTP",
   "延迟补偿"
  ]
 },
 {
  "id": "net-16",
  "cat": "net",
  "level": "高级",
  "type": "multi",
  "q": "MMO 大世界做 AOI（兴趣区域）管理，以下哪些是常见方案或必须处理的点？",
  "options": [
   "网格/九宫格法：按格子索引实体，只同步相邻格子内的对象",
   "十字链表法：按 X、Y 轴维护有序链表，适合对象分布稀疏不均的场景",
   "全服广播所有实体位置，交给客户端自己裁剪",
   "分线/分场景把玩家分散到多个实例，并在实体进入或离开 AOI 时补发状态"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "全服广播的带宽和服务器 CPU 都不可行，所以必须做兴趣管理。网格法实现简单、查询快，但格子大小要按视距和实体密度调，边界处还要处理跨格。十字链表在稀疏大世界上更省内存和遍历成本，但实现复杂。AOI 最关键的是进入和离开事件：新进入视野的玩家必须收到已有实体的完整状态，否则会看到空场景。追问：格子大小怎么定，分线与 AOI 如何配合降频？",
  "tags": [
   "AOI",
   "九宫格",
   "十字链表",
   "分线"
  ]
 },
 {
  "id": "net-17",
  "cat": "net",
  "level": "高级",
  "type": "judge",
  "q": "服务器权威（Server Authoritative）意味着客户端不可信，因此客户端上报的位置数据也不能直接采信。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "服务器权威的核心就是不信任客户端：客户端只上报输入，位置、碰撞、伤害和冷却都由服务器模拟并校验。如果直接采信客户端位置，加速、瞬移类外挂就无法拦截。即便服务器权威，仍要配合速度上限、距离和冷却校验，以及 lag compensation 的边界处理，才能防住大部分作弊。纯客户端权威的方案只适合单机或强信任场景。追问：帧同步架构下客户端有完整逻辑，怎么做反作弊？",
  "tags": [
   "服务器权威",
   "防作弊",
   "校验",
   "状态同步"
  ]
 },
 {
  "id": "net-18",
  "cat": "net",
  "level": "高级",
  "type": "single",
  "q": "三人小团队要做 4v4 实时对战，需要房间匹配、大厅和跨平台联机，且没有服务器运维经验。下列选型判断最合理的是？",
  "options": [
   "选 Mirror，因为它自带托管匹配服务和公网中继",
   "选 Photon（PUN2/Fusion）：托管中继、房间、大厅和匹配开箱即用，接入快，代价是按 CCU 付费且逻辑受其框架约束",
   "选 Netcode for GameObjects 就够了，它自带公网中继和匹配，不需要任何后端",
   "自研 TCP 协议并自己写匹配服，长期成本最低"
  ],
  "answer": [
   1
  ],
  "explain": "Mirror 是开源方案，灵活且免费，但匹配、中继和服务器运维要自己做，小团队容易踩坑。NGO 是官方高层网络框架，本身不含公网中继和匹配，通常要配合 UGS 的 Relay/Lobby 或自建 dedicated server。Photon 提供托管中继、房间、大厅和匹配，接入成本最低，但按 CCU 计费、规模上来后成本高，也有厂商锁定。自研协议加匹配服要处理 NAT 穿透、中继、扩容和防作弊，对三人团队不现实。追问：什么情况下反而应该自建 dedicated server？",
  "tags": [
   "Photon",
   "Netcode for GameObjects",
   "Mirror",
   "匹配服"
  ]
 },
 {
  "id": "arch-01",
  "cat": "arch",
  "level": "基础",
  "type": "single",
  "q": "下面这段 C# 单例实现，在什么场景下最可能出现两个实例？",
  "code": "public class GameManager : MonoBehaviour\n{\n    public static GameManager Instance { get; private set; }\n    private void Awake() { Instance = this; }\n}",
  "options": [
   "同一时刻两个线程同时访问 Instance",
   "场景中放了两个挂载 GameManager 的 GameObject，或切换场景时新实例的 Awake 覆盖了旧实例",
   "在编辑器里点击 Play 按钮",
   "Instance 从未被外部代码访问"
  ],
  "answer": [
   1
  ],
  "explain": "这是最典型的「伪单例」：Awake 里直接赋值，既没有检测已存在实例，也没有 DontDestroyOnLoad，因此两个 GameObject 各执行一次 Awake，后写的覆盖先写的；场景切换时旧对象被销毁、新对象重新赋值，也会出现实例替换或引用悬空。线程安全是另一类问题，但 MonoBehaviour 的 Awake 在 Unity 主线程执行，这里真正的缺陷是缺少唯一性校验与生命周期管理。追问通常会到：为什么不用静态类、Awake 与 Start 的时序、以及跨场景时该销毁谁。",
  "tags": [
   "单例模式",
   "MonoBehaviour",
   "生命周期"
  ]
 },
 {
  "id": "arch-02",
  "cat": "arch",
  "level": "基础",
  "type": "judge",
  "q": "饿汉式单例在类型初始化时就创建实例，因此在多线程下天然安全；懒汉式单例只要在第一次访问时 new 出来，也同样天然线程安全。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "前半句对，后半句错。饿汉式由 CLR 的静态构造保证只执行一次，天然线程安全；懒汉式 if (instance == null) instance = new T(); 是典型的 check-then-act，两个线程可能同时通过判空，各创建一个实例。正确做法是加锁双重检查、使用 Lazy<T>，或依赖 C# 静态字段初始化器。追问常会延伸到双重检查锁定为什么字段要加 volatile（防止指令重排导致拿到未构造完成的对象），以及为什么 MonoBehaviour 单例不能直接用 new。",
  "tags": [
   "单例模式",
   "线程安全",
   "懒汉与饿汉"
  ]
 },
 {
  "id": "arch-03",
  "cat": "arch",
  "level": "基础",
  "type": "single",
  "q": "关于对象池（Object Pool）的设计，下列哪一项是最该被池化的对象特征？",
  "options": [
   "创建成本低、存活时间很短的小型 struct",
   "数量有限、状态需要长期保存的全局管理器",
   "高频创建销毁、初始化开销明显（如加载资源、分配大块内存）的同类对象，如子弹、特效、飘字",
   "只在启动时创建一次的配置数据"
  ],
  "answer": [
   2
  ],
  "explain": "池化的收益来自「复用摊薄创建与销毁成本」，所以目标是高频、同类、构造昂贵的对象；子弹与特效是典型。A 项若真是栈上的 struct，根本没有 GC 压力，池化反而多一层取还开销；B 项管理器应做单例而不是池；D 项只创建一次，池化没有意义。追问会问：回收时如何重置状态、池要不要设上限、以及 Unity 2021 之后内置的 UnityEngine.Pool.ObjectPool 怎么用。",
  "tags": [
   "对象池",
   "性能优化",
   "内存管理"
  ]
 },
 {
  "id": "arch-04",
  "cat": "arch",
  "level": "基础",
  "type": "single",
  "q": "一个角色控制器里同时做了输入读取、移动计算、动画参数设置、血条刷新和音效播放。按「组件化与职责划分」的原则，最先应该做的是什么？",
  "options": [
   "把这些代码原样拆成五个 Partial 分部类文件，逻辑不动",
   "按变化原因拆分为输入、移动、表现等独立组件，组件通过明确的数据（如速度、状态）通信，并调整依赖方向使表现层依赖逻辑层而非相反",
   "把整个类改成静态类，减少 GC",
   "给每一行代码加注释，说明它属于哪个职责"
  ],
  "answer": [
   1
  ],
  "explain": "职责划分的依据是「变化的来源」：输入方案会变、移动手感会变、表现资源会变，它们变化的原因不同，就应该分开。拆完后组件之间用明确的数据契约通信（速度、朝向、状态枚举），并让表现层单向依赖逻辑层，逻辑层不回头调用 UI。A 项只是物理拆分，耦合仍在；C 项静态类无法持有状态；D 项注释不能降低耦合。追问会到：如何避免组件之间互相 GetComponent 形成网、数据该放在谁身上、以及和 ECS 的关系。",
  "tags": [
   "组件化",
   "职责划分",
   "耦合"
  ]
 },
 {
  "id": "arch-05",
  "cat": "arch",
  "level": "基础",
  "type": "judge",
  "q": "命令模式（Command）把一次操作封装成对象，因此它天然支持撤销与回放，并且每个命令都必须实现一个「逆操作」方法才能撤销。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "前两句基本成立：把请求封装为对象后，发起者与执行者解耦，命令可以排队、记录、序列化后重放，撤销栈也建立在这之上。但「必须实现逆操作」是错的，另一种常见做法是保存状态快照，撤销时整体回滚；逆操作在存在不可逆副作用（发奖励、播一次性特效）时并不可靠。追问会到：逆操作与快照的取舍、回放为什么要求逻辑确定性、以及命令对象如何避免每帧分配。",
  "tags": [
   "命令模式",
   "撤销与回放",
   "解耦"
  ]
 },
 {
  "id": "arch-06",
  "cat": "arch",
  "level": "进阶",
  "type": "single",
  "q": "下面这个事件中心的实现存在什么主要问题？",
  "code": "public static class EventCenter\n{\n    public static event Action<int> OnEnemyDead;\n    public static void Raise(int id) => OnEnemyDead?.Invoke(id);\n}",
  "options": [
   "event 不能声明为 static",
   "订阅者被静态委托强引用，若忘记 -=，对象销毁后仍留在委托链上，造成内存泄漏与空引用回调",
   "Action<int> 无法被多个方法订阅",
   "Raise 里使用 ?. 会导致异常被吞掉"
  ],
  "answer": [
   1
  ],
  "explain": "静态 event 的委托链会强引用订阅者的实例方法目标，UI 面板销毁后若没有 -=，委托仍持有该 MonoBehaviour（连同其 GameObject 和资源），使其无法被 GC，形成托管堆泄漏；回调时访问已销毁对象还会抛 MissingReferenceException。A 项错，static event 合法；C 项错，委托天然支持多播；D 项错，?. 只是空检查。追问会延伸到：弱引用事件怎么实现、为什么要在 OnDestroy 统一退订、以及事件通道（EventChannel）相比静态事件的好处。",
  "tags": [
   "事件中心",
   "观察者模式",
   "内存泄漏"
  ]
 },
 {
  "id": "arch-07",
  "cat": "arch",
  "level": "进阶",
  "type": "single",
  "q": "一个角色有「待机 / 移动 / 攻击 / 受击 / 死亡」五种行为，其中受击可以从任意状态进入，死亡可覆盖一切。最合适的实现方式是？",
  "options": [
   "在 Update 里按 if-else 顺序判断布尔标志位",
   "使用分层状态机或带优先级的全局转换，把受击、死亡放进上层或全局转换表",
   "为每种组合写一个独立状态，共 5×5 个",
   "用 Animator 的 BlendTree 代替所有逻辑判断"
  ],
  "answer": [
   1
  ],
  "explain": "当某些状态「全局可进入」时，把它们塞进每个状态的转换条件会导致转换数量爆炸，正确做法是分层状态机（父层处理受击与死亡，子层处理常规行为）或显式的全局转换与优先级。A 项布尔标志会迅速退化成难以维护的隐式状态；C 项组合爆炸；D 项 Animator 只管表现，不应承载游戏逻辑判定。追问会到：状态机与行为树的取舍、如何防止受击打断死亡、以及转换条件如何配置化。",
  "tags": [
   "状态机",
   "分层状态机",
   "角色AI"
  ]
 },
 {
  "id": "arch-08",
  "cat": "arch",
  "level": "进阶",
  "type": "multi",
  "q": "关于对象池的完善实现，下列哪些做法是必要的？（多选）",
  "options": [
   "取出时若池为空则新建，并调用类似 OnSpawn 的初始化或重置逻辑",
   "回收时把速度、计时器、事件订阅、协程等状态清理干净，再调用 OnDespawn 并入池",
   "回收后立刻 Destroy 掉原对象以释放内存",
   "对池设置最大容量，超出时按策略销毁或丢弃，避免无上限增长"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "池化的关键是「复用前状态干净、取还接口成对、容量有上限」。取出时补建保证可用性并重置状态；回收时清理残留状态，否则会出现上一轮的残血、残留特效、重复订阅；设上限防止峰值过后池无限膨胀。C 项与池化的目的矛盾，回收即销毁等于没有池。追问常涉及：池对象的父节点与 active 切换开销、池与 Prefab 变体的关系、以及跨场景时池的清理时机。",
  "tags": [
   "对象池",
   "状态重置",
   "容量控制"
  ]
 },
 {
  "id": "arch-09",
  "cat": "arch",
  "level": "进阶",
  "type": "single",
  "q": "游戏里有「火球 / 冰锥 / 治疗」三种技能，未来还会持续增加；同时怪物、子弹、特效的创建逻辑需要集中管理。按经典模式，合理的职责划分是？",
  "options": [
   "所有技能写在一个 Skill 类里用 switch(type) 分支，对象创建也写在这个类里",
   "技能效果用策略模式（每个技能实现统一接口，可独立增删），对象创建用工厂或工厂方法收敛创建细节，界面用组合模式组织",
   "只用一个巨大的 ScriptableObject 存所有字段，用 if 判断哪个字段非空",
   "为避免类数量增加，全部用反射按字符串调用方法"
  ],
  "answer": [
   1
  ],
  "explain": "策略模式解决「算法可替换且持续新增」的问题，新增技能只需新增一个实现类而不改老代码，符合开闭原则；工厂把「造什么、怎么造、依赖什么资源」的细节集中，调用方只关心拿到可用对象；组合模式负责把技能树、UI 这类树形结构统一对待。A 项 switch 会无限膨胀；C 项把所有字段塞进一个类会退化成弱类型；D 项反射牺牲编译期检查与性能。追问会到：策略如何注册（配置表 + 反射/字典）、工厂与 DI 容器的边界、以及策略对象要不要无状态复用。",
  "tags": [
   "策略模式",
   "工厂模式",
   "组合模式"
  ]
 },
 {
  "id": "arch-10",
  "cat": "arch",
  "level": "进阶",
  "type": "single",
  "q": "在 Unity 中落地 MVVM，下列哪种做法最贴近其数据绑定思想？",
  "options": [
   "View 直接持有 Model 并在 Update 里轮询字段变化",
   "ViewModel 暴露可观察属性（如 INotifyPropertyChanged 或 ReactiveProperty），View 订阅变更并刷新显示，ViewModel 不引用 View",
   "Controller 持有 View 引用，直接调用 View 的方法改文本",
   "把所有逻辑写进 MonoBehaviour，用 SendMessage 通信"
  ],
  "answer": [
   1
  ],
  "explain": "MVVM 的关键是 ViewModel 通过可观察属性向外广播状态变化，View 单向订阅，双方都不知道对方的具体类型，便于测试与换皮。A 项轮询既低效又把 Model 暴露给 View；C 项是 MVP/MVC 里 Presenter 或 Controller 直连 View 的风格；D 项是反模式。追问会到：Unity 没有 WPF 那套原生 Binding，通常用 UniRx、R3 或自写 BindableProperty 实现，以及 Unity 项目里 MVVM 是否值得它的成本。",
  "tags": [
   "MVVM",
   "数据绑定",
   "UniRx"
  ]
 },
 {
  "id": "arch-11",
  "cat": "arch",
  "level": "进阶",
  "type": "single",
  "q": "关于 ECS / DOTS 的数据导向设计，下列描述哪项正确？",
  "options": [
   "ECS 就是把 MonoBehaviour 换成多个小脚本，本质上仍是面向对象",
   "ECS 将数据按组件连续存储、逻辑按系统批量处理，利于缓存命中与 Burst/Job 并行，适合海量同质实体",
   "ECS 适合所有项目，实体越少收益越大",
   "ECS 中的组件可以持有任意托管引用并随意跨系统修改"
  ],
  "answer": [
   1
  ],
  "explain": "DOTS 的收益来自内存布局：同类型组件在 chunk 中连续存放，系统顺序遍历时触发 CPU 缓存预取，再配合 Job System 与 Burst 编译出 SIMD 友好的代码。A 项误解了本质，拆脚本仍是 OOP；C 项说反了，实体规模小、逻辑异构时 ECS 的抽象成本大于收益；D 项 ECS 组件应是 unmanaged 的纯数据，托管引用会破坏 Burst 与并行安全。追问常到：Archetype 与 chunk、结构变更（Structural Change）的开销、以及「只在弹幕或大量小怪上用 DOTS」的混合方案。",
  "tags": [
   "ECS",
   "DOTS",
   "数据导向"
  ]
 },
 {
  "id": "arch-12",
  "cat": "arch",
  "level": "进阶",
  "type": "multi",
  "q": "要把一个「战斗模块」从主工程中解耦，下列哪些手段是有效的？（多选）",
  "options": [
   "用接口或抽象基类定义模块对外契约，调用方只依赖抽象",
   "用依赖注入容器或启动时手动注入，替代模块内部直接 new 或查找单例",
   "在模块内部直接引用 UI 层的具体类型，方便快速调用",
   "用 asmdef 划分程序集并只暴露必要的 public API，用 InternalsVisibleTo 控制可见性"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "解耦的三个抓手是依赖倒置（依赖抽象）、控制反转（外部注入而非内部构造）、以及物理边界（程序集划分与可见性控制）。C 项是典型的反向依赖，会让战斗模块编译依赖 UI，既无法单独复用与测试，也容易造成程序集循环引用。追问会到：接口应该放在哪一层、如何避免「接口满天飞」、以及 asmdef 循环依赖在 Unity 中的报错表现。",
  "tags": [
   "依赖注入",
   "解耦",
   "asmdef"
  ]
 },
 {
  "id": "arch-13",
  "cat": "arch",
  "level": "进阶",
  "type": "judge",
  "q": "划分 asmdef 后，未声明的程序集引用会直接编译失败，因此 asmdef 能强制约束模块边界；同时它也能显著缩小增量编译的范围。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "asmdef 把脚本切成独立程序集，引用关系必须显式声明，未声明的类型直接编译不过，这正是它作为架构约束工具的价值；改动某个程序集只会重编它和下游，增量编译明显更快。需要注意的坑是：不写 asmdef 的脚本进入预定义的 Assembly-CSharp，它不能反向引用 asmdef 程序集；程序集之间不能循环引用；编辑器专用代码要勾选 Editor 平台或单独建 Editor 程序集。追问会到：预定义程序集的引用顺序、InternalsVisibleTo 的用法、以及 asmdef 粒度太细带来的维护成本。",
  "tags": [
   "asmdef",
   "模块化",
   "程序集"
  ]
 },
 {
  "id": "arch-14",
  "cat": "arch",
  "level": "高级",
  "type": "single",
  "q": "配置表驱动设计中，把技能数值从代码搬到 Excel/CSV 再导出为二进制或 ScriptableObject，最主要的架构收益是？",
  "options": [
   "运行时读取速度一定比硬编码快",
   "数值调整与逻辑解耦，策划可独立迭代，且同一套逻辑能通过换表支持多版本与多玩法",
   "可以完全避免空引用异常",
   "不再需要写单元测试"
  ],
  "answer": [
   1
  ],
  "explain": "配置表把「变化的部分」外置，形成数据与逻辑的分离：策划改数值不用改代码、不用重编逻辑，同一套战斗逻辑可以靠换表跑不同关卡或不同版本的数值。A 项不一定，读表有解析与内存开销，常需预生成二进制并按需加载；C、D 项是过度承诺，表里填错 id 照样会空引用和逻辑错误。追问会到：表结构设计（主键、外键、引用完整性校验）、构建期如何校验表与代码一致、以及热更新时表的加载与卸载策略。",
  "tags": [
   "配置表",
   "数据驱动",
   "策划协作"
  ]
 },
 {
  "id": "arch-15",
  "cat": "arch",
  "level": "高级",
  "type": "single",
  "q": "实现「支持回滚（rollback）的存档与回放」时，最稳妥的架构选择是？",
  "options": [
   "每帧序列化整个场景的 GameObject 层级与所有组件字段",
   "把游戏状态收敛为可序列化的纯数据快照，或记录带确定性的输入命令流，按固定步长推进并保证模拟确定性",
   "只保存玩家坐标，其它状态在回滚时重新计算即可",
   "依赖 Physics 的浮点结果，因为 Unity 物理是确定性的"
  ],
  "answer": [
   1
  ],
  "explain": "回滚的可行性取决于「状态能否被完整重建」：要么定期保存完整状态快照（要求状态集中、可序列化），要么用确定性模拟加输入命令流重演（帧同步思路）。A 项序列化整个场景代价极高且含大量不可序列化引用；C 项遗漏状态会导致回滚后表现不一致；D 项错，PhysX 在不同平台与版本上并非严格确定，需要定点数或自写确定性物理。追问会到：快照频率与内存的权衡、逻辑帧与渲染帧分离、以及浮点确定性为什么难保证。",
  "tags": [
   "存档",
   "回滚",
   "确定性"
  ]
 },
 {
  "id": "arch-16",
  "cat": "arch",
  "level": "高级",
  "type": "multi",
  "q": "设计一个通用场景与流程管理框架（启动→登录→大厅→战斗→结算）时，下列哪些是应该考虑的点？（多选）",
  "options": [
   "场景加载用异步加加载界面，并提供进度回调与取消、失败处理",
   "流程节点之间显式声明进入与退出契约以及数据传递方式，避免靠全局静态变量传参",
   "为了简单，所有场景都常驻不卸载，靠 SetActive 切换",
   "处理加载过程中的重复请求与并发切换，保证同一时刻只有一个流程在推进"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "流程框架要解决的是「加载体验、状态契约、并发安全」。异步加载配进度与失败分支是基本要求；流程间通过显式的上下文对象传递参数，可测试也可追踪；并发切换必须加锁或用 token 丢弃过期请求，否则会出现「点了两次进入战斗」的竞态。C 项让所有场景常驻会使内存与初始化成本失控，也破坏场景隔离。追问会到：Additive 多场景的卸载时机、DontDestroyOnLoad 的滥用、以及加载失败如何回退到安全节点。",
  "tags": [
   "场景管理",
   "流程框架",
   "异步加载"
  ]
 },
 {
  "id": "arch-17",
  "cat": "arch",
  "level": "高级",
  "type": "judge",
  "q": "在架构评审中，「为了未来可能的扩展」而提前引入事件总线、DI 容器和多套抽象层通常是合理的，因为架构越通用、扩展性越好。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   1
  ],
  "explain": "这是典型的过度设计。抽象的收益必须由当下真实的变化点来支付：每引入一层间接就增加阅读成本、调试难度与运行时开销，而「未来的需求」往往并不会到来。合理做法是先用清晰直接的代码，在变化真正出现且重复出现两次以上时再抽象。追问常会到：如何判断一个抽象是否值得（变化频率、影响范围）、YAGNI 与可扩展性如何平衡、以及性能与架构在项目不同阶段的取舍。",
  "tags": [
   "过度设计",
   "架构权衡",
   "YAGNI"
  ]
 },
 {
  "id": "arch-18",
  "cat": "arch",
  "level": "高级",
  "type": "single",
  "q": "团队用 UniRx 重写了大量交互逻辑后，发现 GC Alloc 明显上升。最可能的原因与改进方向是？",
  "options": [
   "UniRx 本身必然每帧分配，只能弃用",
   "每次事件都创建新流、lambda 闭包捕获与 Where/Select 链产生分配；应缓存热点流、复用 Subject、用 AddTo 统一生命周期并在必要时避免装箱",
   "只要把 Subscribe 改成 async/await 就没有分配",
   "GC 上升与 UniRx 无关，一定是 UI 的问题"
  ],
  "answer": [
   1
  ],
  "explain": "响应式链路的分配主要来自操作符链上新建的 Observable 对象、lambda 的闭包捕获、以及值类型装箱；在热点路径每帧重建流会持续产生垃圾。改进方式是复用 Subject、把流在初始化时构建一次、用 AddTo(this) 绑定生命周期避免泄漏，必要时用手写事件或结构化的操作符替代。A 项过于绝对；C 项 async 状态机同样有分配；D 项回避了问题。追问会到：如何用 Profiler 定位分配来源、OnNext 里的异常如何隔离、以及 UniRx 与 R3 在分配上的差异。",
  "tags": [
   "UniRx",
   "响应式编程",
   "GC优化"
  ]
 },
 {
  "id": "math-01",
  "cat": "math",
  "level": "基础",
  "type": "single",
  "q": "已知 a、b 为单位向量，dot(a, b) = 0.5。下列判断哪一项正确？",
  "options": [
   "a 与 b 的夹角是 30°，且 b 在 a 方向上的投影长度为 0.5",
   "a 与 b 的夹角是 60°，且 b 在 a 方向上的投影长度为 0.5",
   "a 与 b 垂直，因为点乘结果不为 1",
   "点乘只能判断方向是否相同，无法得到夹角"
  ],
  "answer": [
   1
  ],
  "explain": "dot(a,b) = |a||b|cosθ，单位向量时直接等于 cosθ，cos60° = 0.5，所以夹角 60°；同时投影长度 = dot(b, a 的单位向量) = 0.5。A 项把 arccos 记错成 30°；C 项垂直对应点乘为 0；D 项错，点乘正是求夹角最常用的手段。实战中常用 dot > 0 判断目标是否在身前、dot 与阈值的比较替代昂贵的 acos（比较 cos 值即可，不必开方求角度）。追问会到：非单位向量时为什么要先归一化、以及 acos 的性能与精度问题。",
  "tags": [
   "点乘",
   "投影",
   "夹角"
  ]
 },
 {
  "id": "math-02",
  "cat": "math",
  "level": "基础",
  "type": "single",
  "q": "在 Unity（左手坐标系，Y 轴向上）中，cross(forward, up) 的结果最接近哪个方向？",
  "options": [
   "角色的正前方",
   "角色的右侧",
   "角色的左侧",
   "零向量，因为 forward 与 up 垂直"
  ],
  "answer": [
   1
  ],
  "explain": "叉乘结果垂直于两个输入向量，方向由坐标系手性决定。Unity 是左手系，cross(forward, up) = right；若换成右手系（如 OpenGL 习惯）同样的顺序会得到相反方向，所以跨引擎移植时符号最容易出错。叉乘的模长等于 |a||b|sinθ，几何上等于两向量张成的平行四边形面积，可用于求法线、判断点在直线哪一侧、以及计算旋转轴。C 项是把顺序写反（cross(up, forward) 才得到 left）；D 项错，垂直向量的叉乘模长最大而不是 0。追问会到：如何用叉乘加点的位置判断目标在左前方还是右前方、以及叉乘结果的模长归一化后求平面法线。",
  "tags": [
   "叉乘",
   "坐标系",
   "法线"
  ]
 },
 {
  "id": "math-03",
  "cat": "math",
  "level": "基础",
  "type": "multi",
  "q": "关于 Mathf.Lerp、Vector3.MoveTowards、Vector3.SmoothDamp，下列说法哪些正确？（多选）",
  "options": [
   "Mathf.Lerp(a, b, t) 是按比例逼近，t 固定为 0.1 时每帧只走剩余距离的 10%，帧率不同到达速度就不同，且理论上永远到不了 b",
   "MoveTowards 以固定的 maxDistanceDelta 移动，不会过冲，适合有明确速度要求的位移",
   "SmoothDamp 内部维护速度状态，适合相机跟随这类需要缓入缓出的场合，velocity 需以 ref 传入并跨帧保留",
   "把 t 设为 Time.deltaTime * speed 传给 Lerp，就能得到与帧率无关的匀速运动"
  ],
  "answer": [
   0,
   1,
   2
  ],
  "explain": "Lerp 的语义是「按剩余量比例插值」，本质是几何衰减，帧率变化会改变收敛速度，且数学上只趋近不抵达（实际会因浮点精度停在很近处）；MoveTowards 是按绝对步长移动，不过冲，适合「以 m/s 速度靠近」；SmoothDamp 用临界阻尼弹簧模型维护速度，天然带缓入缓出，是相机跟随的常用方案。D 项错，Lerp 的系数不是速度，dt 只改变衰减的底数，结果仍是变速逼近而非匀速。追问会到：三者各自的时间复杂度与适用场景，以及 Lerp 需要限幅时用 LerpUnclamped 还是 Mathf.Clamp01。",
  "tags": [
   "Lerp",
   "MoveTowards",
   "SmoothDamp"
  ]
 },
 {
  "id": "math-04",
  "cat": "math",
  "level": "进阶",
  "type": "single",
  "q": "关于欧拉角与四元数，下列哪项描述正确？",
  "options": [
   "欧拉角的万向节死锁是因为三个轴的旋转顺序不确定，只要固定顺序就不会发生",
   "四元数用四个分量表示旋转且无奇异，Slerp 能保证插值过程中角速度均匀；但 q 与 -q 表示同一旋转，比较时要注意",
   "四元数可以直观地表示「绕 X 转 30 度、再绕 Y 转 45 度」，因此适合在 Inspector 里手调",
   "Slerp 与 Lerp 对四元数效果完全一样，只是 Slerp 更慢"
  ],
  "answer": [
   1
  ],
  "explain": "万向节死锁不是顺序不确定，而是顺序固定后当中间轴旋转到 ±90° 时，首尾两轴重合、丢失一个自由度，表现为某些方向再也转不过去；四元数是单位四元数（4 维球面上的点），没有这种奇异，Slerp 沿球面大圆插值，角速度恒定。C 项说反了，可读性正是欧拉角的优势、四元数的劣势；D 项错，四元数的 Lerp 是分量线性插值，不做归一化会导致非均匀甚至错误的旋转，nlerp 是归一化后的近似方案。追问会到：Quaternion.LookRotation 与 FromToRotation 的用法、为什么不要直接改 transform.rotation 的分量、以及 q 与 -q 在插值选路径时要取 dot 判断。",
  "tags": [
   "四元数",
   "欧拉角",
   "万向节死锁"
  ]
 },
 {
  "id": "math-05",
  "cat": "math",
  "level": "基础",
  "type": "judge",
  "q": "Unity 中 localToWorldMatrix 可以把本地坐标变换到世界坐标，法线变换应当使用变换矩阵的逆转置而不是直接乘原矩阵。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "顶点变换用 M 把本地坐标变到世界；但法线是方向向量，在存在非均匀缩放时直接乘 M 会让法线不再垂直于表面，正确做法是用 M 的逆转置（inverse transpose）。Unity 的 Shader 里可用内置的 UnityObjectToWorldNormal，它内部就处理了统一缩放与非统一缩放两种情况。追问会到：为什么旋转+等比缩放时可以直接乘 M、MVP 的乘法顺序（投影×视图×模型，从右往左作用于顶点）、以及 transform.TransformPoint 与 TransformDirection 的区别（后者忽略平移）。",
  "tags": [
   "矩阵变换",
   "法线",
   "坐标空间"
  ]
 },
 {
  "id": "math-06",
  "cat": "math",
  "level": "基础",
  "type": "single",
  "q": "下面这行平滑跟随代码，关于其中 1 - pow(1 - t, dt * 60) 的理解哪项正确？",
  "code": "float k = 1f - Mathf.Pow(1f - t, Time.deltaTime * 60f);\ntransform.position = Vector3.Lerp(transform.position, target.position, k);",
  "options": [
   "它把「每帧保留 (1-t) 比例」换算成与帧率无关的等效系数，使不同帧率下相同时间内的收敛程度一致",
   "它等价于 t * Time.deltaTime * 60，只是写法不同",
   "它能让物体在有限时间内精确到达目标点",
   "它只对 60fps 有效，其它帧率仍然会漂移"
  ],
  "answer": [
   0
  ],
  "explain": "几何衰减的合成是乘法：每帧保留 (1-t)，n 帧后剩 (1-t)^n。以 60fps 为基准，dt 秒对应 n = dt*60 帧，所以等效系数为 1-(1-t)^(dt*60)，这样 30fps 和 120fps 在同一段时间内的剩余比例相同。B 项是线性近似，帧率差异大时会有可见偏差；C 项错，指数逼近永远不会精确等于目标，需要靠阈值或 MoveTowards 收尾；D 项错，公式本身就是为了消除帧率差异。追问会到：为什么不直接乘 dt（因为衰减是乘法不是加法）、以及和 SmoothDamp 的取舍。",
  "tags": [
   "帧率无关",
   "插值",
   "平滑跟随"
  ]
 },
 {
  "id": "math-07",
  "cat": "math",
  "level": "进阶",
  "type": "multi",
  "q": "关于 AABB 与 OBB，下列说法哪些正确？（多选）",
  "options": [
   "AABB 的检测只需逐轴比较区间，速度很快，但物体旋转后包围盒会变松、贴合变差",
   "OBB 随物体旋转，通常用分离轴定理（SAT）在若干候选轴上检测，精度更高但开销更大",
   "把物体旋转后的 8 个顶点重新取 min/max 得到的 AABB 是最紧致的包围盒",
   "Collider.bounds 返回的是世界空间下轴对齐的包围盒，物体旋转后它依然是轴对齐的"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "AABB 便宜是因为只需 6 次标量比较，代价是旋转后贴合度下降，宽相位阶段常用它做粗筛；OBB 贴着物体走，需要 SAT 在 15 根候选轴（3+3+9 个叉乘轴）上找分离轴，精度高但开销大，适合窄相位或需要精确判定的场合。C 项错，把旋转后的顶点再包一个轴对齐盒只会更松而不是更紧，旋转后的紧致包围盒就是 OBB。D 项正确，bounds 是世界空间 AABB，常有人误以为它跟随旋转。追问会到：宽相位与窄相位的分工、为什么 Unity 的 MeshCollider 开销大、以及 AABB 树（BVH）如何加速场景查询。",
  "tags": [
   "AABB",
   "OBB",
   "碰撞检测"
  ]
 },
 {
  "id": "math-08",
  "cat": "math",
  "level": "进阶",
  "type": "single",
  "q": "要判断一条射线是否击中球体并求出最近的交点，下列思路哪项正确？",
  "options": [
   "把球心投影到射线上得到最近点，只要该点到球心的距离小于半径就一定有交点，最近交点就是该投影点",
   "把射线方程 o + t·d 代入球方程 |p - c|² = r²，解关于 t 的一元二次方程，取判别式非负时的最小非负根",
   "分别对 x、y、z 三个轴做 AABB 检测，任一轴命中即视为击中球体",
   "用 Vector3.Distance(射线起点, 球心) 与半径比较即可"
  ],
  "answer": [
   1
  ],
  "explain": "标准做法是联立求交：设 f = o - c，方程 (d·d)t² + 2(f·d)t + (f·f - r²) = 0，判别式 ≥ 0 有交点，取两个根中较小的非负值即最近交点；d 为单位向量时二次项系数为 1，可简化。A 项只判断了「射线所在直线」与球相交，且投影点不是交点，还漏掉了交点在射线反方向的情况；C 项用 AABB 近似球会误判；D 项只算了起点到球心的距离，完全没考虑方向。追问会到：为什么必须取非负根、射线起点在球内时怎么处理、以及平面求交（t = dot(n, p0 - o) / dot(n, d)，分母接近 0 时视为平行）。",
  "tags": [
   "射线求交",
   "球体",
   "平面"
  ]
 },
 {
  "id": "math-09",
  "cat": "math",
  "level": "进阶",
  "type": "single",
  "q": "场景中有 2000 个持续移动的单位，每帧都要查询「附近 5 米内有哪些单位」。下列方案最合适的是？",
  "options": [
   "每帧对全部单位两两比较，O(n²)，2000 个约 200 万次距离计算，现代 CPU 完全够用，不必优化",
   "用均匀网格（uniform grid / spatial hashing）按格子索引对象，移动时只更新所在格子，查询时只遍历邻近 3×3 格",
   "用四叉树，每帧把所有对象删掉再重新插入一遍",
   "用八叉树，因为三维场景必须用八叉树"
  ],
  "answer": [
   1
  ],
  "explain": "对象数量多且持续移动时，均匀网格的优势是更新代价 O(1)：移出格子才需要改索引，查询只看邻近格子，实际复杂度接近 O(n·k)。A 项 200 万次/帧在 60fps 下就是 1.2 亿次/秒，加上 GC 与缓存不友好，实际会明显掉帧；C 项每帧重建整棵树，插入删除的开销比暴力还大；D 项八叉树适合稀疏、尺度差异大的静态场景，移动频繁时维护成本高，且本例是地面单位，二维网格足够。追问会到：格子大小如何选（约等于查询半径）、对象跨格怎么处理、以及四叉树在什么场景更优（静态大地图、LOD、视锥裁剪）。",
  "tags": [
   "空间划分",
   "四叉树",
   "均匀网格"
  ]
 },
 {
  "id": "math-10",
  "cat": "math",
  "level": "高级",
  "type": "single",
  "q": "在允许八方向移动（直走代价 1，斜走代价 √2）的网格上做 A*，若启发函数用曼哈顿距离 |dx| + |dy|，会出现什么问题？",
  "options": [
   "没有问题，曼哈顿距离对任何网格都是可采纳的",
   "启发值会高估真实剩余代价（例如纯斜走时真实代价约 1.414·dx，而启发给出 2·dx），可采纳性被破坏，可能返回非最优路径",
   "启发值会低估真实代价，导致搜索变慢但结果仍最优",
   "A* 会退化成 Dijkstra，因为启发恒为 0"
  ],
  "answer": [
   1
  ],
  "explain": "A* 保证最优的前提是启发函数可采纳：h(n) 不超过从 n 到目标的真实最小代价。八方向下曼哈顿距离在纯斜走时等于 2·dx，而真实代价是 1.414·dx，属于高估，会过早认为某些节点「不值得展开」而剪掉最优路径。正确做法是用 octile 距离：D·(dx+dy) + (D2-2D)·min(dx,dy)，其中 D=1、D2=√2；四方向网格才用曼哈顿，任意方向用欧氏距离。C 项说反了，低估才安全（如 h=0 退化为 Dijkstra）；D 项错，恒为 0 是启发缺失而非曼哈顿的结果。追问会到：一致性与节点重复展开、启发权重（加权 A*）的加速与代价、以及 JPS 在均匀网格上的剪枝。",
  "tags": [
   "A*寻路",
   "启发函数",
   "可采纳性"
  ]
 },
 {
  "id": "math-11",
  "cat": "math",
  "level": "进阶",
  "type": "multi",
  "q": "关于 Unity 的 NavMesh 寻路，下列说法哪些正确？（多选）",
  "options": [
   "NavMesh 由场景几何离线烘焙成可行走多边形，运行时在多边形图上寻路，再用漏斗算法（string pulling）把折线拉直",
   "运行时临时出现的障碍可以用 NavMesh Obstacle（carve）或局部重建 NavMeshSurface 来处理",
   "NavMeshAgent.SetDestination 会立刻返回一条直线路径，绕障由物理系统自动完成",
   "OffMeshLink 可以表达跳跃、爬梯这类不连续连接，可手动放置也可运行时生成"
  ],
  "answer": [
   0,
   1,
   3
  ],
  "explain": "NavMesh 的本质是「可行走区域的凸多边形剖分」，寻路是在多边形邻接图上跑 A*，代价用的是跨边距离，最后用漏斗算法把经过的 portal 拉成尽量少的直线段，所以路径看起来是贴边的折线。C 项错，SetDestination 只是设置目标，路径由内部异步计算，绕障来自 NavMesh 拓扑而不是物理碰撞。动态障碍是常见追问点：carve 会在障碍周围挖洞让其他 agent 绕行，但频繁开关有开销，静态几何变化才考虑重新烘焙。还要注意 agent 的半径、高度、坡度、跳跃距离都会影响烘焙结果。",
  "tags": [
   "NavMesh",
   "寻路",
   "动态障碍"
  ]
 },
 {
  "id": "math-12",
  "cat": "math",
  "level": "进阶",
  "type": "single",
  "q": "用 Mathf.PerlinNoise 生成地形高度时，下列哪项描述正确？",
  "options": [
   "它返回 0~1 的平滑随机值，相同输入永远得到相同输出，所以换种子要靠偏移采样坐标；单个八度过于规律，通常叠加多个频率（fBm）才自然",
   "它每次调用都会返回不同的随机值，适合做逐帧噪声",
   "它返回 -1~1 的值，并且在整数格点处取到最大值",
   "它生成的是白噪声，相邻采样点之间完全没有相关性"
  ],
  "answer": [
   0
  ],
  "explain": "Perlin 是梯度噪声：在整数格点上取值为 0（这是它的特征，也意味着直接用格点采样会得到一片 0），值域大约 -1~1，Mathf.PerlinNoise 映射到 0~1；它是确定性的纯函数，没有内部种子，换种子只能给采样坐标加偏移。单个频率显得规律，程序化地形一般叠加多个八度（每个八度频率翻倍、振幅减半），即 fBm。B 项混淆了 Random.value；C 项错在格点取值为 0 而非最大；D 项错，白噪声才是不相关的，Perlin 的价值恰恰是空间连续性。追问会到：Perlin 与 Simplex 的差异（高维开销、方向性伪影）、域扭曲（domain warping）、以及为什么地形高度要按 chunk 采样以保证无缝。",
  "tags": [
   "Perlin噪声",
   "程序化生成",
   "fBm"
  ]
 },
 {
  "id": "math-13",
  "cat": "math",
  "level": "高级",
  "type": "single",
  "q": "让相机沿一条三次贝塞尔曲线匀速飞行，若直接令参数 t 随时间线性递增来采样曲线，会出现什么问题？",
  "options": [
   "没有影响，贝塞尔曲线的参数 t 与弧长天然成正比",
   "贝塞尔曲线的参数 t 与弧长是非线性关系，控制点疏密会造成速度忽快忽慢，需要按弧长重参数化（预计算长度表再反查 t）",
   "只有二次贝塞尔有这个问题，三次贝塞尔是匀速的",
   "只要把四个控制点等距摆放就能保证匀速"
  ],
  "answer": [
   1
  ],
  "explain": "B(t) 是关于 t 的多项式，dt 相等并不代表位移相等：控制点密集处同样的 Δt 走过的弧长更短，视觉上就是忽快忽慢。工程做法是先用 de Casteljau 或采样把曲线离散成折线并累计弧长，建立「弧长 → t」的查找表，运行时按目标速度推进弧长再反查 t（可再插值细化）。A 项是常见误解；C 项错，所有次数的贝塞尔都有此性质；D 项等距控制点也只在特定形状下近似匀速。追问会到：de Casteljau 相比直接展开多项式的数值稳定性、切线如何求（对 B(t) 求导得到速度方向）、以及 Catmull-Rom 样条为什么更适合过点路径。",
  "tags": [
   "贝塞尔曲线",
   "弧长参数化",
   "相机路径"
  ]
 },
 {
  "id": "math-14",
  "cat": "math",
  "level": "高级",
  "type": "judge",
  "q": "float 大约只有 7 位有效十进制数字，当世界坐标远离原点（如 10 万米）时精度会退化到厘米甚至更大，因此大型世界常采用分块局部坐标或相机相对渲染来缓解。",
  "options": [
   "正确",
   "错误"
  ],
  "answer": [
   0
  ],
  "explain": "IEEE 754 的单精度 float 有 23 位尾数，数值越大绝对精度越差：在 1e5 量级上最小可分辨间隔约为 0.0078，叠加物理与动画累积误差后会出现抖动、Z-fighting、角色卡顿。常见对策是浮动原点（floating origin，定期把世界整体平移回原点）、分块局部坐标系、以及相机相对渲染（渲染时把相机置于原点，只把相对位移传给 GPU）。追问会到：double 是否值得（带宽与 GPU 支持）、为什么 0.1f 无法精确表示、以及比较浮点数为什么用 Mathf.Approximately 或容差而不是 ==。",
  "tags": [
   "浮点精度",
   "大世界",
   "数值稳定性"
  ]
 }
];
