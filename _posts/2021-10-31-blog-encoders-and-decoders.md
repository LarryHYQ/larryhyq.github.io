---
title: '编码器和解码器'
date: 2021-10-31
permalink: /blog/2021/10/encoders-and-decoders/
tags:
  - Deep Learning
  - Nature Language Processing
---

本文介绍编码器与解码器架构，说明如何将输入序列转换为中间表示并生成输出序列，并通过代码定义可扩展的编码器、解码器及组合模型接口。

{% raw %}

### 🎦 本节课程视频地址 👇

<div align="center">
  <a href="https://www.bilibili.com/video/BV1c54y1E7YP" target="_blank">
    <img src="/images/blog/Images/d2l-480b3eccc706945d.webp" alt="Bilibil" referrerpolicy="no-referrer">
  </a>
</div>

## 编码器和解码器


<div align="center">
  <img src="/images/blog/Images/049-01.gif" alt="049-01" referrerpolicy="no-referrer">
</div>


**重新考察CNN**

- 编码器：将输入编程成中间表达形式（特征）
- 解码器：将中间表示解码成输出

**重新考察RNN**

- 编码器：将文本表示成向量
- 解码器：将向量表示成输出

**编码器-解码器架构**

- 一个模型被分为两块
  - 编码器处理输入
  - 解码器生成输出
    - 解码器可以有额外的输入


<div align="center">
  <img src="/images/blog/Images/049-02%EF%BC%882%EF%BC%89.jpg" alt="049-02（2）" referrerpolicy="no-referrer">
</div>


**API**
释义来自于百度：
API（Application Programming Interface，应用程序接口）是一些预先定义的接口（如函数、HTTP接口），或指软件系统不同组成部分衔接的约定。用来提供应用程序与开发人员基于某软件或硬件得以访问的一组例程，而又无需访问源码，或理解内部工作机制的细节。

### 代码实现

**编码器**

```python
from torch import nn

class Encoder(nn.Module):
    """编码器-解码器架构的基本编码器接口"""
    def __init__(self, **kwargs):
        super(Encoder, self).__init__(**kwargs)

    def forward(self, X, *args):
        raise NotImplementedError
        # 在程序的指定位置手动抛出一个异常
```


**解码器**

```python
class Decoder(nn.Module):
    """编码器-解码器架构的基本解码器接口"""
    def __init__(self, **kwargs):
        super(Decoder, self).__init__(**kwargs)

    def init_state(self, enc_outputs, *args):
        #拿到enc的输出，转换成中间形式
        raise NotImplementedError

    def forward(self, X, state):
        raise NotImplementedError
        
```


**编解码器**

```python
class EncoderDecoder(nn.Module):
    """编码器-解码器架构的基类"""
    def __init__(self, encoder, decoder, **kwargs):
        super(EncoderDecoder, self).__init__(**kwargs)
        self.encoder = encoder
        self.decoder = decoder

    def forward(self, enc_X, dec_X, *args):
        enc_outputs = self.encoder(enc_X, *args)
        dec_state = self.decoder.init_state(enc_outputs, *args)
        return self.decoder(dec_X, dec_state)
```

**总结**
- 编码器进行输入-输出转化
- 解码器把编码器输出编码成中间state，联合输入，实现最终输出
- 这一架构就是NLP实现的基础

{% endraw %}
