---
title: '数据操作及数据预处理'
date: 2021-09-16
permalink: /blog/2021/09/data-preprocessing/
tags:
  - deep-learning
  - basic-knowledge
---

本文介绍了深度学习中 N 维数组的概念，以及使用 PyTorch 和 Pandas 进行数据操作和预处理的基本方法，包括张量的创建、运算、广播机制以及 CSV 文件的读取和缺失值处理。

### 🎦 本节课程视频地址 👇

<a href="https://www.bilibili.com/video/BV1CV411Y7i4" target="_blank">
  <img src="https://i1.hdslb.com/bfs/archive/2bed5e04146c92346fae88a6d41156002ab49fb7.jpg@640w_400h_100Q_1c.webp" alt="Bilibil" referrerpolicy="no-referrer">
</a>

## N 维数组

- **N=0**：标量。一般表示分类问题中指代一个类别
- **N=1**：向量。一般表示一个样本经过特征化后的特征向量
- **N=2**：矩阵。一般表示数据集或者其中的 Batch，每一行为一个样本；或一张黑白图片的明暗表示(宽 X 高)
- **N=3**：一般用于表示一张彩色图像(宽 X 高 X 通道)；或黑白图像数据集(批量大小 X 宽 X 高)
- **N=4**：一般用于表示彩色图像的数据集或其中的 Batch(批量大小 X 宽 X 高 XRGB 通道)
- **N=5**：一般用于表示一段视频(批量大小 X 时间 X 宽 X 高 XRGB 通道)

**定义矩阵**
维度、精度、赋值

## 数据操作

### 访问元素

- **`[1,3]`**：访问二维数组单一元素
- **`[2,:]`**：只有冒号，代表将此维度全部取出
- **`[1:3,1:]`**：冒号前后跟数字代表取一个*前闭后开*区间的元素，**多在 CNN 中用于在整张图片矩阵中取出一个子区域的数据操作来与卷积核进行运算**
- **`[::3,::2]`**：两个冒号后代表隔几个元素取，**多用于 CNN 中的“空洞卷积”操作**

<img src="https://oscimg.oschina.net/oscnet/239b526729ef1ca62868d6269c62831ce24.jpg" alt="空洞卷积" referrerpolicy="no-referrer">

### Pytorch 数据基本操作

- `torch.arange(N)`：生成一个从 0~N-1 的一维 Tensor
- `torch.shape`：获得张量的形状
- `torch.numel()`：获得张量中所有元素的个数
- `[tensor].reshape(m,n,o...)`：将一个 Tensor 重塑为$(m \times n \times o...)$形状
- `torch.zeros((m,n))`：生成一个 $m \times n$ 的全零张量(一般用于初始化偏置 Bias)
- `torch.ones((m,n))`：生成一个 $m \times n$ 的全 1 张量
- `torch.tensor([list])`：将 Python 列表转换为张量
- `[tensor1]**[tensor2]`：按元素求幂运算
- `torch.exp([tensor])`：按元素求指数 $e^x$
- `torch.cat([tensor1],[tensor2],dim=0)`：按行(第 0 维)纵向连接两个张量(dim=1 为按列横向连接)，如果维度更高，可以 dim>=2
- torch 继承了 numpy 的广播机制，不同维度的数组可以进行元素运算，但两个数组至少有一个维度相同
- `[tensor][X,Y] = m`：元素赋值
- `[tensor][:]`：元素改写，不改变内存地址
- `[tensor].sum()`：求和所有元素得到标量
- `[tensor].numpy()`：将张量转换为 Numpy 数组
- `torch.tensor([ndarray] | [list] | [Dataframe])`：将其他格式数据转换为张量格式
- `[tensor].item()` | `float([tensor])` | `int([tensor])`：将大小为 1 的张量转换为 Python 标量

## Pandas 数据基本操作

- `pd.read_csv(file)`：读取 CSV 文件并转换为 Pandas Dataframe 格式
- `[Dataframe].iloc[:,0:2]`：取出对应索引的数据分片
- `[Dataframe].fillna(value)`：补充缺失数据
- `pd.get_dummies([Dataframe, dummy_na=True])`：将离散类别进行 One-hot 编码成数字，同时将缺失值当成一种类别

