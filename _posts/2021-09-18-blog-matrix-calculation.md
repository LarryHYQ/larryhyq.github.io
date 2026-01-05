---
title: '矩阵计算'
date: 2021-09-18
permalink: /blog/2021/09/matrix-calculation/
tags:
  - Deep Learning
  - Basic Knowledge
  - Math Basics
---

本文深入探讨了矩阵求导在深度学习中的意义，详细介绍了标量、向量、矩阵之间相互求导的规则和形状变化，并总结了分子布局下的求导公式，为理解反向传播算法奠定数学基础。

### 🎦 本节课程视频地址 👇

<div align="center">
<a href="https://www.bilibili.com/video/BV1eZ4y1w7PY" target="_blank">
  <img src="https://i2.hdslb.com/bfs/archive/c6e841abe7cb95476e44d0b724b4f12cda91a285.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
</a>
</div>

### 🎦 关于微积分相关知识，继续强烈推荐**3Blue1Brown**的超棒教程 👇

<div align="center">
<a href="https://space.bilibili.com/88461692/channel/detail?cid=13407&ctype=0" target="_blank">
  <img src="https://i1.hdslb.com/bfs/archive/11aab6ed64acf0bf9ca9d48ec97796a724490427.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
</a>
</div>

## 矩阵求导的意义

在深度学习里，本质是非凸参数优化问题，例如数据的特征化、损失函数和优化算法的选择，**都是将原本不可导的问题转换为可导的目标**，进而通过数据迭代计算梯度，再沿梯度反方向微调参数，直至结果收敛在一个合适的区间。

## 将导数拓展到向量

$$
\begin{array}{c|lcc}
& x & \bf{x} \\
\hline
y & {\partial{y}\over\partial{x}} \ \text{(标量)} & {\partial{y}\over\partial{\bf{x}}} \ \text{(行向量)} \\
\bf{y}​ & {\partial{\bf{y}}\over\partial{x}} \ \text{(列向量)} & {\partial{\bf{y}}\over\partial{\bf{x}}} \ \text{(矩阵)} \\
\end{array}
$$

- 标量对向量求导得到**行向量**：

$$
\begin{array}{c|cccc}
\text{y} & a & au & \text{sum}(\bf{x}) & ||\bf{x}||^2 \\
\hline
\frac{\partial{y}}{\partial{\bf{x}}} & \bf{0}^T & a\frac{\partial{u}}{\partial{\bf{x}}} & \bf{1}^T & 2\bf{x}^T
\end{array}
$$

其中， $a$ 表示与向量 $\bf{x}$ 无关的函数；$\bf{0}^T$ 、 $\bf{1}^T$ 是与列向量 $\bf{x}$ 元素个数相同的行向量

$$
\begin{array}{c|lcc}
\text{y} & u+v & uv & \langle{\bf{u},\bf{v}}\rangle \\
\hline
\frac{\partial{y}}{\partial{\bf{x}}} & \frac{\partial{u}}{\partial{\bf{x}}}+\frac{\partial{v}}{\partial{\bf{x}}} & \frac{\partial{u}}{\partial{\bf{x}}}v+\frac{\partial{v}}{\partial{\bf{x}}}u & \bf{u}^T\frac{\partial{\bf{v}}}{\partial{\bf{x}}}+\bf{v}^T\frac{\partial{\bf{u}}}{\partial{\bf{x}}}\text{ (行向量)}
\end{array}
$$

- 向量对标量求导得到**列向量**
- 向量对向量求导得到**矩阵**：

相当于向量 $\bf{y}$ 中每一个标量对向量 $\bf{x}$ 求导

即当：

$$
\bf{x}=
\begin{bmatrix} x_1 \\ x_2 \\ \vdots \\ x_n
\end{bmatrix}，\bf{y}=
\begin{bmatrix} y_1 \\ y_2 \\ \vdots \\ y_m
\end{bmatrix}
$$

时，

$$
{\begin{bmatrix}
\partial{y_1}\over\partial\bf{x}\\
\partial{y_2}\over\partial\bf{x}\\
\partial{y_3}\over\partial\bf{x}\\
\end{bmatrix}}=
{\begin{bmatrix}
\partial{y_1}\over\partial{x_1}&\partial{y_1}\over\partial{x_2}&\partial{y_1}\over\partial{x_3}\\
\partial{y_2}\over\partial{x_1}&\partial{y_2}\over\partial{x_2}&\partial{y_2}\over\partial{x_3}\\
\partial{y_3}\over\partial{x_1}&\partial{y_3}\over\partial{x_2}&\partial{y_3}\over\partial{x_3}\\
\end{bmatrix}}
$$

> 此处以 3 维向量的求导为例。

其中，向量$\bf{x}\in\Bbb{R^n}$，$\bf{y}\in\Bbb{R^m}$，$\bf{a}$ 和 $\bf{A}$ 表示与向量 $\bf{x}$ 无关的函数；$\bf{0}$ 、 $\bf{I}$ 是 $(m\times{n})$ 的矩阵

$$
\begin{array}{c|lcc}
\bf{y} & a\bf{u} & \bf{Au} & \bf{u+v} \\
\hline
\frac{\partial{\bf{y}}}{\partial{\bf{x}}} & a\frac{\partial{\bf{u}}}{\partial{\bf{x}}} & \bf{A}\frac{\partial{\bf{u}}}{\partial{\bf{x}}} & \frac{\partial{\bf{u}}}{\partial{\bf{x}}}+\frac{\partial{\bf{v}}}{\partial{\bf{x}}}
\end{array}
$$

- 推广标量、向量、矩阵相互求导后 shape 的关系：

$$
\begin{array}{ll|lll}
&& \text{标量} & \text{向量} & \text{矩阵} \\
&& x\ (1,) & \bf{x}\ \text{(n,1)} & \bf{X}\ \text{(n,k)} \\
\hline
\text{标量} & y\ \text{(1,)} & {\partial{y}\over\partial{x}}\ (1,) & {\partial{y}\over\partial{\bf{x}}}\ (1,n) & {\partial{y}\over\partial{\bf{X}}}\ (k,n) \\
\text{向量} & \bf{y}\ \text{(m,1)} & {\partial{\bf{y}}\over\partial{x}}\ (m,1) & {\partial{\bf{y}}\over\partial{\bf{x}}}\ (m,n) & {\partial{\bf{y}}\over\partial{\bf{X}}}\ (m,k,n) \\
\text{矩阵} & \bf{Y}\ \text{(m,l)} & {\partial{\bf{Y}}\over\partial{x}}\ (m,l) & {\partial{\bf{Y}}\over\partial{\bf{x}}}\ (m,l,n) & {\partial{\bf{Y}}\over\partial{\bf{X}}}\ (m,l,k,n) \\
\end{array}
$$

为方便记忆，当分母为向量或矩阵时，求导后的 Shape 可看成将分母的 Shape**转置**后再与分子的 Shape 进行相乘运算。

这里我们对求导结果同一采用**分子布局**表示，即结果为行向量。