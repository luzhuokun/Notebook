## 自身优缺点

- 有责任心，抗压能力强，做事效率高
- 有点内向，但通过不断地与他人沟通中锻炼，逐渐克服内向的缺点

## 介绍你们公司的项目开发流程

- 需求评审
  - 确定有哪些功能点和改动的地方
- 工时预估、排期、设立开发里程碑
  - 确定工作量和实现目标，以及人员安排
- 设计评审、接口评审
  - 确定前后端负责的部分，复杂的业务逻辑尽量放在后端实现，前端只负责渲染交互上的问题
  - 根据 restful 风格设计接口（JSON 格式返回、语义化请求方法：get（获取）、post（创建）、put（更新）、delete（删除）），确定字段类型，以及调用时机等等
  - 除了 restful 接口风格，还有 GraphQL（只需一个请求，根据定义的 schema 结构，就能获取所有需要的数据）、gRPC（基于 http2.0，支持双向通信，常用于微服务通信，在公共网络中使用可能受防火墙等影响）
- 开发
  - 前端后端独立开发，自己 mock 数据
- 联调
- 测试
  - 一轮
  - 二轮
  - 回归（涉及的功能点比较多才进行）
- 上线、观察监控系统
- 复盘总结、归档

[API 架构的选择，RESTful、GraphQL 还是 gRPC](https://blog.csdn.net/peida/article/details/130776824)

## 如何进行前后端协作

- 双方沟通开会讨论，明确开发目标，理清前后端各自职责
- 制定合适的 api 接口文档
- 前期各自根据接口文档 mock 独自开发
- 后期都完成功能后按照计划联调
- 最后测试通过上线

## 如何成为一名合格的 leader

- 要有`责任心`，以身作则，做好带头表率
- 提升`个人实力`，不断学习`专业知识`和`管理知识`
- 同时做好`向上管理`和`向下管理`
  - 向上管理
    - 做好汇报反馈
    - 落实好每一件事
    - 合理提出建议和解决方案
  - 向下管理
    - 主动`关心`组员情绪，了解组员性格，让组员做他擅长的事
    - 营造良好的`团队氛围`，可以多组织团建、下午茶、技术分享等等
    - `维护`组员的利益，为组员争取福利
    - `设立奖罚机制`，给积极表现的组员给予奖励
    - 对待每个组员做到`一视同仁`，就事论事
    - 遇问题优先解决问题，与组员`一起总结反思`，避免下次再发生
- 尊重下属
- 明确目标
- 做事要有原则，坚持企业核心价值观和工作底线

## 如果团队有一名能力很强，但不怎么服从纪律管理，你会怎么处理？

- 首先是肯定和尊重他为公司和团队做出的贡献
- 然后尝试沟通，拉近他和团队的距离，以及提醒他个人发展需要集体和管理的支持
- 了解他为什么不服从纪律管理，知道对方想要什么和害怕什么
- 如果沟通后还是无法调和，向上汇报，以及考虑调岗或辞退

## 遇到不服从管理的老员工，应该如何处理？

- 给予足够的尊重
- 在团队中，征求其意见，让其有参与感
- 私底下多请教，毕竟老员工，一些业务问题比很多人都了解
- 多沟通，拉近彼此的关系
- 如果沟通无效，该辞退还是要辞退

## 团队成员热情不高，工作不积极，你会怎么做？

- 了解不积极的原因
  - 待遇问题
  - 发展问题
  - 企业文化问题
- 如果工作安排的问题，我会对工作安排合理地调整和细化，制定对应的 KPI 和奖罚制度
- 通过团队建设拉动团队情绪，激活工作热情

## 团队成员出现内部矛盾，你会如何处理？

- 首先了解出现矛盾的原因（来龙去脉）
  - 利益问题
  - 诚信问题
  - 价值观问题
- 参与调和，安抚情绪，原则上不能影响正常工作、团队士气、价值观取向
- 要观察影响的范围
  - 如果是内部两人的问题，没有特别严重的地步则自行解决
  - 如果涉及团队或其他部门，则要立即处理，如果无法调和则考虑辞退

## 员工内部互相推卸责任，如何处理？

- 了解具体情况，理清当中的问题和职责，避免再次发生
- 并且强调团队合作的重要性

## 员工越级汇报，作为领导的你，你该如何处理？

- 首先从自身上找原因，为什么会出现员工不信任自己
- 优化团队内部的工作汇报机制，形成更好的良性沟通渠道

## 员工打小报告，你如何处理？

- 对下属工作情况要有清晰的管控
- 打小报告很容易形成职场政治，不利于团队发展
- 听取员工小报告内容，了解背后的原因，酌情处理
- 建立良好的沟通渠道，定期听取员工的意见和反馈

## 送礼功能

- 送礼面板、送礼、扣金币、扣钱、渲染动画特效
- 礼物 10 多种类型
  - 普通礼物
  - 付费礼物（一级、二级、三级）
  - 包裹礼物
  - 经验卡
  - 道具
- 新增了一种礼物叫聊天气泡

## 陪玩功能

- 主播角色
- 用户角色
- 加入陪玩
- 主播接受陪玩

- 中途加需求情况（如果是工期内能完成就没事，如果没有就跟产品商量延期）
- 普通管理员、超级管理员
