# 代码

## 教程

- video: [Training my First NEURAL NETWORK in C++ and SFML - AI Tutorial](https://youtu.be/Zrrnqd0rCXg)

<iframe width="560" height="315" src="https://www.youtube.com/embed/Zrrnqd0rCXg" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

## 展示

[](code.html ":include :type=iframe width = 650px height=540px")

## 代码主逻辑

> 采用面向`对象`的方法和`事件驱动`的模式

- 输入: 鼠标, 键盘等
- 输出: 整个画面的颜色分布

```mermaid
flowchart LR
    subgraph colorButton ["<a href='#颜色按钮'>颜色按钮</a>"]
    direction LR
        colorButtonCallBack["callback:响应按钮"]
    end

    subgraph startButton ["<a href='#开始按钮'>开始按钮</a>"]
    direction LR
        startButtonCallBack["callback:start/stop"]
    end

    subgraph brain ["<a href='#神经网络'>神经网络</a>"]
    direction LR
        brainUpdate["update: 训练/显示误差"]
        predict["预测"]
    end

    subgraph canvas ["<a href='#图像'>图像</a>"]
    direction LR
        canvasUpdate["update: 更新图像"]
    end

    subgraph pointer ["<a href='#鼠标'>鼠标</a>"]
    direction LR
        pointerCallBack["callback: 绘画圆点/采样"]
    end

    colorButton -- "按钮信息" --> pointer -- "采样信息" --> brain

    startButton -- "控制" --> brain

    brain -- "预测" --> canvas
```

> `update`: 表示每帧都调用的
>
> `callback`: 对象有消息时响应

[](main.js ":include :type=code js")

### 颜色按钮

[](ColorButton.js ":include :type=code js")

### 开始按钮

[](StartButton.js ":include :type=code js")

### 鼠标

[](Pointer.js ":include :type=code js")

### 神经网络

[](Brain.js ":include :type=code js")

### 图像

[](Canvas.js ":include :type=code js")
