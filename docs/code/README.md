# 代码

## 教程

- video: [Training my First NEURAL NETWORK in C++ and SFML - AI Tutorial](https://youtu.be/Zrrnqd0rCXg)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Zrrnqd0rCXg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 展示

[](code.html ":include :type=iframe height=600px")

## 代码主逻辑

- 输入: 鼠标, 键盘等
- 输出: 整个画面的颜色分布

```mermaid
flowchart TD
    s(start)
    input[/"<a href='#输入'>输入</a>"/]
    deal["<a href='#处理'>处理</a>"]
    output[\"<a href='#输出'>输出</a>"\]
    e(end)
    s --> input --> deal --> output --> e
```

### 输入

- 输入: 鼠标, 键盘等
- 输出: 代码信息

```mermaid
flowchart TD
    s(start)
    input[/"设备"/]
    r_msg["key_r + MouseLeft"]
    g_msg["key_g + MouseLeft"]
    b_msg["key_b + MouseLeft"]
    train["key_s"]
    msg[\"合并的信息"\]
    e(end)
    subgraph AI_Data
        r_msg
        g_msg
        b_msg
    end
    s --> input --> AI_Data -- "(x, y, color)" --> msg --> e
    input --> train -- "启动训练" --> msg
```

### 处理

- 输入: 合并的信息
- 输出: 图像信息

```mermaid
flowchart TD
    s(start)
    input[/"合并的信息"/]
    checkTrain{"是否训练"}
    randomTrain["随机抽样训练"]
    calcError["计算误差"]
    predict["预测"]
    output[\"图像信息"\]
    e(end)
    s --> input --> checkTrain
    checkTrain -- "Yes" --> randomTrain --> calcError --> predict --> output
    checkTrain -- "No" --> predict
    output --> e
```

- 计算误差

  预测所有的样本值, 与真值比较, 得到误差

### 输出

- 输入: 图像信息
- 输出: 绘制图像

```mermaid
flowchart TD
    s(start)
    input[/"图像信息"/]
    circle["绘制点"]
    neuron["画神经网络图"]
    color["绘画颜色分布"]
    error["输出误差信息"]
    e(end)
    s --> input
    input --> circle --> e
    input --> neuron --> e
    input --> color --> e
    input --> error --> e
```
