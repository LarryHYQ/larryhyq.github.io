---
title: '线性回归'
date: 2021-09-20
permalink: /blog/2021/09/linear-regression/
tags:
  - Deep Learning
  - Basic Knowledge
  - Math Basics
---

本文深入探讨了线性回归模型的基本原理，将其等价为单层神经网络进行解析。详细介绍了损失函数、代价函数、解析解及梯度下降优化算法的数学原理，并分别展示了基于 PyTorch 的从零代码实现与利用框架组件的简洁实现，为理解深度学习模型的训练过程奠定基础。

### 🎦 本节课程视频地址 👇

<div align="center">
  <a href="https://www.bilibili.com/video/BV1PX4y1g7KC" target="_blank">
    <img src="https://i2.hdslb.com/bfs/archive/950e97e853af4b37aace6af6021e55345d7432e3.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
  </a>
</div>

## 回归（Regression）

在机器学习领域，大致可分为**回归**与**分类**两类问题。

回归是指一类为一个或多个自变量与因变量之间关系建模的方法。在自然科学和社会科学领域，回归经常用来表示输入和输出之间的关系；在现实生活中，回归常用于解决**预测**问题。

**线性回归**（Linear Regression）是最简单的一种回归模型，在对结果精度要求不高、现实情况相对不复杂的情况（假设满足线性关系），使用线性回归可以简便快速地得到可接受的结果。

线性回归模型可以等价看作是激活函数为线性函数$\sigma=wx$的**单层神经网络**模型。其中输入层**节点数量**等于数据**特征个数**：

<div align="center">
  <img src="https://zh.d2l.ai/_images/singleneuron.svg" alt="单层神经网络" referrerpolicy="no-referrer">
</div>

### 房价预测

- 预测模型假设房价与特征**呈线性关系**，即：输出 = 输入的加权和 + 标量偏差

$$
y = \langle\mathbf{w}, \mathbf{x}\rangle+b=
w_1x_1+w_2x_2+...+w_nx_n+b
$$

线性模型可以看作单层神经网络，该层神经元的激活函数为线性映射函数。

- 训练数据——收集一些数据点来决定模型参数（权重、偏差），称之为训练数据，多多益善，数据过少容易造成模型的欠拟合或过拟合，影响模型泛化能力。后期会介绍如果数据过少，如何进行**数据增强**、**自监督训练**（MAE）、**强化学习**等途径克服这一问题。

通常为方便计算机使用并行加速运算能力，会**向量化**训练数据表示为列向量，相关理论可参考吴恩达 Deeplearning 课程第 17 节内容 👉[Bilibili](https://www.bilibili.com/video/BV1FT4y1E74V?p=17)，形式为：

$$
\mathbf{X}=[\mathbf{x}_1, \mathbf{x}_2, \mathbf{x}_3, ..., \mathbf{x}_n]^T
$$

$$
\mathbf{y}=[y_1, y_2, y_3, ..., y_n]^T
$$

（其中 $\mathbf{X}$ 的每一行是一个样本，对应列向量 $\mathbf{y}$ 中的一个标签元素）

- **损失函数**（Loss function）：用于衡量预估质量，通常我们会选择非负数作为损失，且数值越小表示损失越小，完美预测时的损失为 0。 回归问题中最常用的损失函数是平方误差函数。下式表示每个样本的损失：

$$
l(y,\hat{y})=\frac{1}{2}(y-\hat{y})^2
$$

> 其中，式中的 $\frac{1}{2}$ 为方便求导

<div align="center">
  <img src="https://zh.d2l.ai/_images/fit-linreg.svg" alt="单层神经网络" referrerpolicy="no-referrer">
</div>

- **代价函数**（Cost function）：在训练数据集上的损失平均

$$
L(\mathbf{X}, \mathbf{y}, \mathbf{w}, b)=\frac{1}{2n}\sum_{i=1}^n(y_i-\langle\mathbf{w}, \mathbf{x}_i\rangle-b)^2=\frac{1}{2n}||\mathbf{y}-\mathbf{X}\mathbf{w}-b||^2
$$

- 最小化代价函数来学习参数：

$$
\mathbf{w}^*, b^* = \mathop{\mathrm{argmin}}_{\mathbf{w}, b} L(\mathbf{X}, \mathbf{y}, \mathbf{w}, b)
$$

- 显式解：线性回归问题存在最优的解析解

  首先将特征矩阵增加一列全 1 向量，再将偏差`b`合并进权重 **`w`**，以简化表示：

  $$
  \mathbf{X}\leftarrow[\mathbf{X}, \mathbf{1}]
  $$

  $$
  \mathbf{w}\leftarrow\begin{bmatrix} \mathbf{w}\\ b\\ \end{bmatrix}
  $$

  则：

  $$
  l(\mathbf{X}, \mathbf{y}, \mathbf{w})=\frac{1}{2n}||\mathbf{y}-\mathbf{X}\mathbf{w}||^2
  $$

  $$
  \frac{\partial}{\partial\mathbf{w}}l(\mathbf{X}, \mathbf{y}, \mathbf{w})=\frac{1}{n}(\mathbf{y}-\mathbf{X}\mathbf{w})^T\mathbf{X}
  $$

  该损失函数是凸函数，其最优解满足求对应参数偏导为零：

$$
\frac{\partial}{\partial\mathbf{w}}l(\mathbf{X}, \mathbf{y}, \mathbf{w})=0
$$

$$
\frac{1}{n}(\mathbf{y}-\mathbf{X}\mathbf{w})^T\mathbf{X}=0
$$

即当：

$$
\mathbf{w}^*=(\mathbf{X}^T\mathbf{X})^{-1}\mathbf{X}\mathbf{y}
$$

时，得到解析解，代价函数取得最小值。

## 优化方法

### 梯度下降

如果一个模型没有显式解，就需要借助数值方法。
首先可随机初始化一个参数值${\bf{w_0}}$，重复迭代$t=1,2,3...$，令：

$$\mathbf{w}_t=\mathbf{w}_{t-1}-\eta\frac{\partial l}{\partial\mathbf{w}_{t-1}}$$

> 其中，学习率（$\eta$）：步长的超参数（hyperparameter）,不能太小（会导致收敛时间过慢）也不能太大（产生震荡，无法收敛）。

以此沿**负梯度方向**不断减小损失函数值。梯度下降就是不断延着负梯度方向更新求解，不需要求解显式解的形式，只要可导即可。

### 小批量随机梯度下降 (SGD)

在整个训练集上算梯度实在太贵
可以随机采样$b$个样本$i_1,i_2,...,i_b$来近似损失

$$\frac{1}{b}\sum_{i\in I_b}l(\mathbf{x}_i, y_i, \mathbf{w})$$

$b$为批量大小（batch），另外一个重要的超参数。**为最大化计算效率，一般与运算设备（如 GPU）的存储大小相关，如 256、512、2048……**

## 线性回归的从零代码实现

- 以线性噪声为例

> 构造数据集
> 假设初始 ${\bf{w}}=[2,-.3.4]^T$，$b=4.2$，定义线性回归函数：
> $y={\bf{X}}{\bf{w}}+b+\epsilon$
> ，其中$\epsilon$为样本噪声

```python
def synthetic_data(w, b, num_examples):
    x = torch.normal(0, 1, (num_examples, len(w)))
    ## 从平均值为0，方差为1的正态分布随机创造num_examples个（这里是1000）张量，其长度与w相同，输出是一个1000×2的矩阵。
    y = torch.matmul(X, w) + b
    ## mutmul()是矩阵乘法。
    y += torch.normal(0, 0.01, y.shape)
    ## 添加个随机扰动
    return X, y.reshape(-1, 1)

true_w = torch.tensor([2, -3.4])
true_b = 4.2
features, labels = synthetic_data(true_w, true_b, 1000)
## features特征，表示已有的数据集，labels是真值。
```

- 每次读取一个小批量

```python
def data_iter(batch_size, features, labels):
    num_examples = len(features)
    indices = list(range(num_examples))
    ## 得到一个与特征等长的序列
    random.shuffle(indices)
    ## 打乱该序列
    for i in range(0, num_examples, batch_size):
        batch_indices = torch.tensor(indices[i:min(i + batch_size, num_examples])
        yield features[batch_indices], labels[batch_indices]
    ## 确定批次量作为步长，这里取10，生成器每运行一次，就会创造出一个长度为10的张量。

batch_size = 10

for X, y in data_iter(batch_size, features, labels):
    print(X, '\n', y)
    break
    ## break 用于中断生成器，要么就会生成100组。
```

- 定义模型

```python
w = torch.normal(0, 0.01, size=(2, 1), requires_grad=True)
b = torch.zeros(1, requires_grad=True)
## 设置初值。

def linreg(X, w, b):
    return torch.matmul(X, w) + b
## 定义模型
```

- 定义平方差损失函数

```python
def squared_loss(y_hat, y):
    return(y_hat - y.reshape(y_hat.shape)) ** 2 / 2
```

- 定义 SGD 优化算法

```python
def sgd(params, lr, batch_size):
    with torch.no_grad():
    ## 更新参数不需要求导
         for param in params:
         ## 传入w, b的列表。
            param -= lr * param.grad / batch_size
            param.grad.zero_()
            ## pyTorch需要手动梯度清零
    ## 对于列表对象，函数中改变就会改变全局变量，故不需return
```

- 训练步骤

```python
  lr = 0.03
  num_epochs = 3
  net = linreg
  loss = squared_loss
  ## 定义超参数

  for epoch in range(num_epochs):
  ## 打乱一遍，出100组，一共打乱三遍。
    for X, y in data_iter(batch_size, features, labels):
        l = loss(net(X, w, b), y)
        l.sum().backward()
        ## 前面定义了b, w的grad_requires=True
        sgd([w, b], lr, batch_size)
    with torch.no_grad():
        train_l = loss(net(features, w, b), labels)
        ## 显示每遍历完一遍后的最终损失。
        print('output:')

```

## 线性回归的简单实现

这里使用 Pytorch 已有的常用组件

````python
import numpy as np
import torch
from torch.utils import data
from d2l import torch as d2l

## 创建数据集
true_w = torch.tensor([2, -3.4])
true_b = 4.2
features, labels = d2l.synthetic_data(true_w, true_b, 1000)

## 创建批量
def load_array(data_arrays, batch_size, is_train=True):
    dataset = data.TensorDataset(*data_arrays)  # *代表传入列表
    ## 把X,y连成列表作为数据集
    return data.DataLoader(dataset, batch_size, shuffle=is_train)
    ## DataLoader()函数表示提取一个批次。

batch_size = 10
data_iter = load_array((features, labels), batch_size)

next(iter(data_iter))


from torch import nn
net = nn.Sequential(nn.Linear(2, 1))
## Linear()线性回归，输入输出的维度。Sequential()表示List of Layers

net[0].weight.data.normal_(0, 0.01)
## 设置权重参数w的初始值。
net[0].bias.data.fill_(0)

## 调入损失函数
loss = nn.MSELoss()

## 调入优化方法
trainer = torch.optim.SGD(net.parameters(), lr=0.03)
## parameters是network里所有的参数，包括w和b。

## 训练
num_epochs = 3
for epoch in range(num_epochs):
    for X, y in data_iter:
        l = loss(net(X), y)
        trainer.zero_grad()
        l.backward()
        # 在执行过.backward()得到梯度后，才能执行.step()更新参数
        trainer.step()
    l = loss(net(features), labels)
    print(f'epoch {epoch + 1}, loss {1:f}')
````

## Pytorch 模块参考文档

- `torch.utils.data`数据处理模块 🧐[中文](https://pytorch-cn.readthedocs.io/zh/latest/package_references/data/) / [官方英文](https://pytorch.org/docs/stable/data.html)
- `torch.nn`神经网络基本 Block，如全连接层、卷积层、损失函数等的实现 🧐[中文](https://pytorch-cn.readthedocs.io/zh/latest/package_references/torch-nn/) / [官方英文](https://pytorch.org/docs/stable/nn.html)
- `torch.optim`神经网络常用优化器的实现 🧐[中文](https://pytorch-cn.readthedocs.io/zh/latest/package_references/torch-optim/) / [官方英文](https://pytorch.org/docs/stable/optim.html)

---

## Q&A🤓

**Q：batchsize 是否会影响模型精度结果？**

**🙋‍♂️**：反直觉的是，小 batchsize 可能会提高精度，因为相当于人为引入（放大）了数据中的噪音，提高了神经网络的泛化性。

**Q：为什么优化算法不使用二阶导算法（如牛顿法），说不定结果更快更好？**

**🙋‍♂️**：首先二阶导在计算成本上开销特别大，同时数据维数会指数增加，有的还无法求出准确的二阶导。同时还有可能使得优化曲面不如一阶导平坦，最终收敛结果不见得比一阶导好。（沐神此处延申至人生哲理：起跑快，**so what**🤷‍♂️ 容易扯着蛋）
