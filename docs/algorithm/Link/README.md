# 链表

## 删除链表中给定的节点（移除链表节点）

```js
function ListNode(val?, next?) {
  this.val = val === undefined ? 0 : val;
  this.next = next === undefined ? null : next;
}
const removeElements = function (head, val) {
  let cur = head;
  let prev = new ListNode(null, head);
  let ans = prev;
  while (cur) {
    if (cur.val === val) {
      prev.next = cur.next;
    } else {
      prev = cur;
    }
    cur = cur.next;
  }
  return ans.next;
};
```

## 反转链接

```js
const reverseList = function (head) {
  let cur = head;
  let prev = null;
  while (cur) {
    let next = cur.next;
    cur.next = prev;
    prev = cur;
    cur = next;
  }
  return prev;
};
```

## 返回链表中间节点（快慢指针）

```js
const findMiddle = function (head) {
  let slot = head;
  let fast = head;
  while (fast && fast.next) {
    slot = slot.next;
    fast = fast.next.next;
  }
  return head;
};
```

## 输出链表倒数第 K 个节点

```js
const getKthFromEnd = function (head, k) {
  let slot = head;
  let fast = head;

  while (k) {
    fast = fast.next;
    k--;
  }

  while (fast) {
    slot = slot.next;
    fast = fast.next;
  }
  return slot;
};
```

## 找出第一个公共节点（相交链表）

分别从 a+b 链、b+a 链出发，当发现公共节点时返回

```js
const getIntersectionNode = function (headA, headB) {
  if (!headA || !headB) return null;
  let pA = headA;
  let pB = headB;
  while (pA !== pB) {
    pA = pA ? pA.next : headB;
    pB = pB ? pB.next : headA;
  }
  return pA;
};
```

## 判断链表是否有环（环形链表）（走 3 步、4 步可以吗，可以但走 2 步就够了）

快慢指针，相遇了就返回，如果访问到 null 就返回

## 回文链表

快慢指针+反转指针

## 返回链表开始有环的第一个节点（环形链表 II）

快慢指针 + 相遇时 fast 指针从头跟 slot 指针一步一步走一遍，再次相遇时就是环开始的地方
