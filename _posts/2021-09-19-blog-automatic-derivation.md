---
title: '自动求导'
date: 2021-09-19
permalink: /blog/2021/09/automatic-derivation/
tags:
  - Deep Learning
  - Basic Knowledge
  - Math Basics
---

本文深入探讨了深度学习中自动求导的核心机制。首先讲解了向量与矩阵求导的链式法则及具体推导示例；接着详细解析了计算图（Computational Graph）的原理、正反向传播的计算与内存复杂度；最后介绍了基于 PyTorch 的自动微分代码实现与常用操作，为理解深度学习框架的底层运算逻辑奠定基础。

### 🎦 本节课程视频地址 👇

<div align="center">
  <a href="https://www.bilibili.com/video/BV1KA411N7Px" target="_blank">
    <img src="https://i0.hdslb.com/bfs/archive/feadafc9bf7283f84caacc60d841a4202b0395eb.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
  </a>
</div>

## 向量求导的链式法则

- 标量链式法则

$$
y=f(u),u=g(x) \\
\frac{\partial{y}}{\partial{x}}=\frac{\partial{y}}{\partial{u}}\frac{\partial{u}}{\partial{x}}
$$

- 向量链式法则(求导结果的 shape 可以参考[第六课](_posts/2021-09-18-blog-matrix-calculation.md))

$$
\frac{\partial{y}}{\partial{\bf{x}}}=\frac{\partial{y}}{\partial{u}}\frac{\partial{u}}{\partial{\bf{x}}} \\
\text{(1,n)    (1,)(1,n)} \\
$$

$$
\frac{\partial{y}}{\partial{\bf{x}}}=\frac{\partial{y}}{\partial{\bf{u}}}\frac{\partial{\bf{u}}}{\partial{\bf{x}}} \\
\text{(1,n)    (1,k)(k,n)} \\
$$

$$
\frac{\partial{\bf{y}}}{\partial{\bf{x}}}=\frac{\partial{\bf{y}}}{\partial{\bf{u}}}\frac{\partial{\bf{u}}}{\partial{\bf{x}}} \\
\text{(m,n)    (m,k)(k,n)} \\
$$

- 向量链式法则求导示例：

假设：向量 $\mathbf{x}, \mathbf{w} \in \mathbb{R}^n$，$y \in \mathbb{R}$，$z=(\langle \mathbf{x}, \mathbf{w} \rangle - y)^2$，求 $\frac{\partial z}{\partial \mathbf{w}}$ ？

令：

$$
a={\langle\bf{x,w}\rangle}
$$

$$
b={a-y}
$$

$$
z=b^2
$$

则：

$$
\begin{aligned}
    \frac{\partial{z}}{\partial{\bf{w}}}
    &=\frac{\partial{z}}{\partial{b}}
    \frac{\partial{b}}{\partial{a}}
    \frac{\partial{a}}{\partial{\bf{w}}} \\ \\
    &=\frac{\partial{b^2}}{\partial{b}}
    \frac{\partial{a-y}}{\partial{a}}
    \frac{\partial{\langle\bf{x,w}\rangle}}{\partial{\bf{w}}} \\ \\
    &={2b\cdot1\cdot\bf{x}^T} \\
    &=2(\langle{\bf{x,w}}\rangle-y)\bf{x}^T
\end{aligned}
$$

- 矩阵链式法则求导示例

假设：矩阵 $\mathbf{X} \in \mathbb{R}^{m \times n}$，向量 $\mathbf{w} \in \mathbb{R}^n$，$\mathbf{y} \in \mathbb{R}^m$，$z=\Vert\mathbf{X}\mathbf{w}-\mathbf{y}\Vert^2$，求 $\frac{\partial z}{\partial \mathbf{w}}$ ？

令：

$$
\mathbf{a}=\mathbf{Xw}
$$

$$
\mathbf{b}=\mathbf{a-y}
$$

$$
z=||\bf{b}||^2
$$

则：

$$
\begin{aligned}
    \frac{\partial{z}}{\partial{\bf{w}}}
    &=\frac{\partial{z}}{\partial{\bf{b}}}
    \frac{\partial{\bf{b}}}{\partial{\bf{a}}}
    \frac{\partial{\bf{a}}}{\partial{\bf{w}}} \\ \\
    &=\frac{\partial{||\bf{b}||}^2}{\partial{\bf{b}}}
    \frac{\partial{\bf{a-y}}}{\partial{\bf{a}}}
    \frac{\partial{\bf{Xw}}}{\partial{\bf{w}}}  \\ \\
    &={2\bf{b}^T\cdot\bf{I}\cdot\bf{X}} \\
    &=2{({\bf{Xw}}-\bf{y})}^T{\bf{X}}
\end{aligned}
$$

## 计算图

计算图是几乎目前所有深度学习框架使用的、用于实现神经网络计算的底层模型，是将复杂运算拆分成由多个简单运算符（操作子）组成的**有向无环图（DAG, Directed Acyclic Graph**），可以实现**自动求导**（正向传播、反向传播 Backpropagation）功能。

<div align="center">
  <img src="https://zh.d2l.ai/_images/forward.svg" alt="forward" referrerpolicy="no-referrer">
</div>

关于反向传播算法，推荐观看3Blue1Brown博主的科普视频👇

<div align="center">
  <a href="https://www.bilibili.com/video/BV16x411V7Qg" target="_blank">
    <img src="https://i1.hdslb.com/bfs/archive/c617e8ce539c6dfb96fb89e7d2feec919b609b5d.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
  </a>
</div>


使用计算图模型，可更方便的进行**并行化运算**（惰性求值），同时拆分成简单的运算符，可充分利用专有硬件（如 GPU 等）实现**硬件加速**来提升计算效率，详细内容可参考👉[这里](https://zh.d2l.ai/chapter_computational-performance/auto-parallelism.html)

正向传播复杂度：

- 计算复杂度为**O(n)**，n 代表计算图中操作子数目
- 内存复杂度为**O(1)**，1 表示每次计算只用存储当前操作子的数据，计算下一操作时便可释放前一个中间结果，所以为常量复杂度

反向传播复杂度：

- 计算复杂度为**O(n)**，与正向复杂度类似
- 内存复杂度为**O(n)**，因为计算反向梯度时，需要所有操作子正向传播的中间结果

以上复杂度也决定了当神经网络非常大时，在训练过程中，对内存（CPU 计算）或显存（GPU 计算）容量要求非常高，因为所消耗的容量正比于神经网络节点数。

关于计算图相关知识，李沐的视频教程较为简略，可参考官方文档中的文字讲解 👉[点击这里](https://zh.d2l.ai/chapter_multilayer-perceptrons/backprop.html)，同时还可观看吴恩达(AndrewNG)的 DeepLearning.ai 课程中的《计算图》章节 👇

<a href="https://www.bilibili.com/video/BV1FT4y1E74V?p=13" target="_blank">
  <img src="/images/blog/Images/computation_graph_andrew.jpg">
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