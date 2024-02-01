// First-class data structures Tact makes it easy to declare, decode and encode data structures according to their TL-B schemas.
// 一流的数据结构 Tact 可以根据数据结构的 TL-B 模式轻松声明、解码和编码数据结构。

contract DataTypes {
    init(initBool: Bool, initStr: String, intMap: map<Int, Address>){
        self.b3 = !(initBool);
        self.s2 = initStr;
        self.intMap = intMap;
    }
    // ############## 1. Primitives
    // Primitives: Int, Bool, Slice, Cell, Builder, String and StringBuilder;
    // 整数 Int：

    //默认257为有符号整数 range -2^256 to 2^256 - 1 (takes 257 bit = 32 bytes + 1 bit)
    intMax257bitSigned: Int as int257 = 1;
    // range 0 to 2^256 - 1 (takes 256 bit = 32 bytes)
    int256bitUnsigned: Int as uint256 = 32;

    receive("int"){
        let add: Int = (self.intMax257bitSigned + self.int256bitUnsigned);
        let sub: Int = (self.intMax257bitSigned - self.int256bitUnsigned);
        let mul: Int = self.intMax257bitSigned * self.int256bitUnsigned;
        let div: Int = self.intMax257bitSigned / self.int256bitUnsigned;
        let mini: Int = min(self.intMax257bitSigned, self.int256bitUnsigned); //max, abs
    }

    // String and StringBuilder
    s1: String = "hello tact";
    s2: String;

    receive("string"){
        let sb: StringBuilder = beginString();
        //sb.append(self.a1.toString());
        sb.append(self.s1);
        let sss: String = sb.toString();
    }

    // Bool
    b1: Bool = true;
    b2: Bool = false;
    b3: Bool;

    receive("bool"){
        let boo: Bool = self.b1 && self.b2 || !(self.b3);
        if (boo) {
            dump(boo);
        }
    }

    // Address
    a1: Address = address("UQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0j-8");

    receive("address"){
        self.a1 = newAddress(0, 0);
        self.a1 = newAddress(0, 0x4ea29e0017d44d8760c6d4dd7265fcc5336f2f64d52546302d8e984e11531dd2);
        self.a1 = myAddress(); // this contract address
        self.a1 = sender(); // address of msg sender(in init is deployer)
    }

    // Slice
    // Cell
    // Builder

    // ##############  2. Map（Include Array）
    // Key 只能是 Int 或者 Address
    // value 可以是 Int，bool，Address， Struct/Message
    intMap: map<Int, Address>;

    receive("map"){
        let addressMap: map<Address, Int> = emptyMap();
        addressMap.set(address("UQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0j-8"), 100);
    }

    receive(msg: PointMsg){
        let p: Point = Point{x: (msg.x + 1), y: msg.y};
        let msgVar: PointMsg = PointMsg{x: (msg.x + 100), y: self.s1};
    }
}
// ##############  3. Structs and Messages
// 结构和消息几乎是相同的东西，唯一的区别是消息在其序列化中具有标头，因此可以用作接收器。
struct Point {
    x: Int;
    y: String;
}
message PointMsg {
    x: Int;
    y: String;
}

// ##############  4. Contracts and traits（Interface）
contract SimpleContractDemo {
    counter: Int;
    init(){
        self.counter = 0;
    }

    receive("increment"){
        self.counter = (self.counter + 1);
    }

    get fun counter(): Int {
        return self.counter;
    }
}
// 类似抽象类：Trait 定义了必填字段，函数、接收器。
trait HaveOwner {
    owner: Address;

    receive("myowner"){
        // return self.owner;
    }

     fun requireOwner() {
        nativeThrowUnless(132, context().sender == self.owner);
    }

    get fun owner(): Address {
        return self.owner;
    }
}

contract HaveOwnerCon with HaveOwner {
    owner: Address;
    init(add: Address){
        self.owner = add;
    }

    receive("myowner2"){
        self.owner = address("UQBOop4AF9RNh2DG1N1yZfzFM28vZNUlRjAtjphOEVMd0j-8");
    }
}