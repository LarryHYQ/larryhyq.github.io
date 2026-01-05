---
title: '自动求导'
date: 2021-09-19
permalink: /blog/2021/09/automatic-derivation/
tags:
  - Deep Learning
  - Basic Knowledge
  - Math Basics
---

本文深入探讨了矩阵求导在深度学习中的意义，详细介绍了标量、向量、矩阵之间相互求导的规则和形状变化，并总结了分子布局下的求导公式，为理解反向传播算法奠定数学基础。

### 🎦 本节课程视频地址 👇

<a href="https://www.bilibili.com/video/BV1KA411N7Px" target="_blank">
  <img src="https://i0.hdslb.com/bfs/archive/feadafc9bf7283f84caacc60d841a4202b0395eb.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
</a>

## 向量求导的链式法则

- 标量链式法则

$$
y=f(u),u=g(x) \\
{{\partial{y}}\over{\partial{x}}}={{\partial{y}}\over{\partial{u}}}{{\partial{u}}\over{\partial{x}}}
$$

- 向量链式法则(求导结果的 shape 可以参考[第六课](_posts/2021-09-18-blog-matrix-calculation.md))

$$
{{\partial{y}}\over{\partial{\bf{x}}}}={{\partial{y}}\over{\partial{u}}}{{\partial{u}}\over{\partial{\bf{x}}}} \\
\text{(1,n)    (1,)(1,n)} \\
$$

$$
{{\partial{y}}\over{\partial{\bf{x}}}}={{\partial{y}}\over{\partial{\bf{u}}}}{{\partial{\bf{u}}}\over{\partial{\bf{x}}}} \\
\text{(1,n)    (1,k)(k,n)} \\
$$

$$
{{\partial{\bf{y}}}\over{\partial{\bf{x}}}}={{\partial{\bf{y}}}\over{\partial{\bf{u}}}}{{\partial{\bf{u}}}\over{\partial{\bf{x}}}} \\
\text{(m,n)    (m,k)(k,n)} \\
$$

- 向量链式法则求导示例：

假设：向量 $\bf{x,w}\in\Bbb{R}^n$，$y\in\Bbb{R}$，$z=(\langle{\bf{x,w}}\rangle-y)^2$，求 ${\partial{z}}\over{\partial{\bf{w}}}$ ？

令：

$$
a={\langle\bf{x,w}\rangle} \\
b={a-y} \\
z=b^2
$$

则：

$$
\begin{aligned}
    {\partial{z} \over {\partial{\bf{w}}}}
    &={\partial{z} \over {\partial{b}}}
    {\partial{b} \over{\partial{a}}}
    {\partial{a} \over{\partial{\bf{w}}}} \\ \\
    &={\partial{b^2}\over{\partial{b}}}
    {\partial{a-y}\over{\partial{a}}}
    {\partial{{\langle\bf{x,w}\rangle}} \over {\partial{\bf{w}}}} \\ \\
    &={2b\cdot1\cdot\bf{x}^T} \\
    &=2(\langle{\bf{x,w}}\rangle-y)\bf{x}^T
\end{aligned}
$$

- 矩阵链式法则求导示例

假设：矩阵 $\bf{X}\in\Bbb{R}^{m\times{n}}$，向量$\bf{w}\in{\Bbb{R^n}}$，$y\in\Bbb{R^m}$，$z=||\bf{Xw-y}||^2$，求${\partial{z}}\over{\partial{\bf{w}}}$ ？

令：

$$
{\bf{a}=\bf{Xw}} \\
{\bf{b}=\bf{a-y}} \\
z=||\bf{b}||^2
$$

则：

$$
\begin{aligned}
    {\partial{z}\over{\partial{\bf{w}}}}
    &={{\partial{z}\over{\partial{\bf{b}}}}}
    {{\partial{\bf{b}}\over{\partial{\bf{a}}}}}
    {{\partial{\bf{a}}\over{\partial{\bf{w}}}}
    } \\ \\
    &={{\partial{||\bf{b}||}^2\over{\partial{\bf{b}}}}}
    {{\partial{\bf{a-y}}\over{\partial{\bf{a}}}}}
    {\partial{{\bf{Xw}}}\over{\partial{\bf{w}}}}  \\ \\
    &={2\bf{b}^T\cdot\bf{I}\cdot\bf{X}} \\
    &=2{({\bf{Xw}}-\bf{y})}^T{\bf{X}}
\end{aligned}
$$

## 计算图

计算图是几乎目前所有深度学习框架使用的、用于实现神经网络计算的底层模型，是将复杂运算拆分成由多个简单运算符（操作子）组成的**有向无环图（DAG, Directed Acyclic Graph**）👉[Wiki](https://zh.wiki.hancel.org/wiki/%E6%9C%89%E5%90%91%E6%97%A0%E7%8E%AF%E5%9B%BE)，可以实现**自动求导**（正向传播、反向传播 Backpropagation👉[Wiki](https://zh.wiki.hancel.org/wiki/%E5%8F%8D%E5%90%91%E4%BC%A0%E6%92%AD%E7%AE%97%E6%B3%95)）功能。

<img src="https://zh.d2l.ai/_images/forward.svg" alt="forward" referrerpolicy="no-referrer">

关于反向传播算法，推荐观看3Blue1Brown博主的科普视频👇

<a href="https://www.bilibili.com/video/BV16x411V7Qg" target="_blank">
  <img src="https://i1.hdslb.com/bfs/archive/c617e8ce539c6dfb96fb89e7d2feec919b609b5d.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
</a>


使用计算图模型，可更方便的进行**并行化运算**（惰性求值），同时拆分成简单的运算符，可充分利用专有硬件（如 GPU 等）实现**硬件加速**来提升计算效率，详细内容可参考👉[这里](https://zh.d2l.ai/chapter_computational-performance/auto-parallelism.html)

正向传播复杂度：

- 计算复杂度为**O(n)**，n 代表计算图中操作子数目
- 内存复杂度为**O(1)**，1 表示每次计算只用存储当前操作子的数据，计算下一操作时便可释放前一个中间结果，所以为常量复杂度

反向传播复杂度：

- 计算复杂度为**O(n)**，与正向复杂度类似
- 内存复杂度为**O(n)**，因为计算反向梯度时，需要所有操作子正向传播的中间结果

以上复杂度也决定了当神经网络非常大时，在训练过程中，对内存（CPU 计算）或显存（GPU 计算）容量要求非常高，因为所消耗的容量正比于神经网络节点数。

关于计算图相关知识，李沐的视频教程较为简略，可参考官方文档中的文字讲解 👉[点击这里](https://zh.d2l.ai/chapter_multilayer-perceptrons/backprop.html)，同时还可观看吴恩达(AndrewNG)的 DeepLearning.ai 课程中的《计算图》章节 👇

[![computation_graph_andrew]()](https://www.bilibili.com/video/BV1FT4y1E74V?p=13)

<a href="https://www.bilibili.com/video/BV1FT4y1E74V?p=13" target="_blank">
  <img src="/images/blog/2021-09-19-blog-automatic-derivation/computation_graph_andrew.jpg">
</a>

## 自动求导代码实现

目前几乎所有的深度学习框架（Pytorch、TensorFlow、MXNet etc.）可通过自动计算导数，即**自动微分**（automatic differentiation）来加快求导。

实际中，根据我们设计的模型，系统会构建一个计算图（computational graph）， 来跟踪计算是哪些数据通过哪些操作组合起来产生输出。 自动微分使系统能够随后反向传播梯度。 这里，反向传播（backpropagate）意味着跟踪整个计算图，填充关于每个参数的偏导数。

- `tensor1.requires_grad_(True)`：告诉框架需要对<u>**该张量**</u>求导
- `tensor2.backward()`：求 tensor2 对 tensor1 导数（tensor2 需为 tensor1 的表达式，且求导前要执行`requires_grad_(True)`命令）
- `tensor1.grad`：访问求导后张量的导数
- `tensor.grad.zero_()`：梯度清零（Pytorch 默认会累计梯度并存储在`.grad`内）
- `tensor.detach()`：将该变量移出计算图，当作常量处理，多用于神经网络的参数固定
- 一般很少用到向量对向量（以及更高阶）的求导，需要引入一个 gradient 参数，所以会把一个向量转化为标量求导，最常用的就是求和：`tensor.sum().backward()`。`loss`一般是一个标量，如果 loss 是矩阵，维度就会越算越大。
- 可以经过 Python 计算流再求导。