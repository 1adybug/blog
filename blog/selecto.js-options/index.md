---
slug: selecto.js-options
title: selecto.js 配置项
authors: [1adybug]
date: 2024-09-30
tags: [selecto.js]
---

`Selecto.js` 是一个用于在网页上进行拖拽选择的 `JavaScript` 库，允许用户通过绘制选择框来选择页面上的元素。通过配置选项，您可以自定义 `Selecto` 的行为和功能。以下是每个配置选项的详细说明：

1. **container**

   - **类型**：`HTMLElement | string`
   - **默认值**：`document.body`
   - **作用**：指定选择区域的容器元素。`Selecto` 会在该容器内检测和选择元素。可以直接传入 `DOM` 元素或选择器字符串。

2. **dragContainer**

   - **类型**：`HTMLElement | string`
   - **默认值**：`container`
   - **作用**：指定触发拖拽事件的容器。通常用于在特定区域内启用或禁用拖拽选择。

3. **selectableTargets**

   - **类型**：`string[]`
   - **默认值**：`[]`
   - **作用**：定义可被选择的目标元素的选择器数组。只有匹配这些选择器的元素才会响应选择操作。

4. **hitRate**

   - **类型**：`number`
   - **默认值**：`100`
   - **作用**：设置元素被选择所需的覆盖率（百分比）。值为 0-100，表示选择框覆盖元素的比例达到该值时，元素即被选中。

5. **selectByClick**

   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：是否允许通过单击来选择元素。设置为 `true` 时，用户可以直接点击元素进行选择。

6. **selectFromInside**

   - **类型**：`boolean`
   - **默认值**：`true`
   - **作用**：是否允许从被选择元素的内部开始拖拽选择。设置为 `false` 时，用户无法从目标元素内部开始绘制选择框。

7. **continueSelect**

   - **类型**：`boolean`
   - **默认值**：`false`
   - **作用**：是否在新的选择操作中保留之前选中的元素。设置为 `true`，新的选择结果会累加到已有的选择中。

8. **toggleContinueSelect**

   - **类型**：`string | string[]`
   - **默认值**：`null`
   - **作用**：指定用于切换 `continueSelect` 状态的按键。当按下指定的键时，`continueSelect` 状态会被激活或关闭。例如：`'shift'`、`['ctrl', 'meta']`。

9. **keyContainer**

   - **类型**：`HTMLElement | Document | Window`
   - **默认值**：`window`
   - **作用**：指定用于监听键盘事件的容器。当使用 `toggleContinueSelect` 功能时，需要监听键盘事件以切换选择模式。

10. **ratio**

    - **类型**：`number`
    - **默认值**：`0`
    - **作用**：设置选择框的固定宽高比。值为 0 时，不限制宽高比。非零值会使选择框按照指定比例缩放。

11. **scrollOptions**

    - **类型**：`object | null`
    - **默认值**：`null`
    - **作用**：配置自动滚动选项，当选择框到达容器边缘时，容器会自动滚动。包含以下属性：
      - `container`: 滚动的容器元素或选择器。
      - `threshold`: 触发滚动的距离阈值。
      - `speed`: 滚动速度。
      - `getScrollPosition`: 自定义获取滚动位置的方法。

12. **boundContainer**

    - **类型**：`HTMLElement | string | null`
    - **默认值**：`null`
    - **作用**：限制选择框的活动范围。选择框无法超出指定的容器边界。

13. **preventDefault**

    - **类型**：`boolean`
    - **默认值**：`false`
    - **作用**：是否在拖拽选择时调用 `event.preventDefault()`，以防止默认的浏览器行为（如文本选中、图片拖拽等）。

14. **cspNonce**

    - **类型**：`string`
    - **默认值**：`null`
    - **作用**：用于 Content Security Policy（内容安全策略）的 nonce 值，确保内联样式在启用了 CSP 的环境下被正确应用。

15. **checkInput**

    - **类型**：`boolean`
    - **默认值**：`false`
    - **作用**：是否在选择操作中检查输入元素（如 `<input>`、`<textarea>`）。设置为 `true` 时，选择操作不会影响这些输入元素的交互。

16. **preventDragFromInside**

    - **类型**：`boolean`
    - **默认值**：`true`
    - **作用**：是否防止从目标元素内部开始拖拽选择。设置为 `true`，可以避免与内部元素的拖拽操作冲突。

17. **getElementRect**

    - **类型**：`function`
    - **默认值**：`(el) => el.getBoundingClientRect()`
    - **作用**：自定义获取元素位置和尺寸的方法。可用于处理特殊情况或优化性能。

18. **dragCondition**

    - **类型**：`function`
    - **默认值**：`() => true`
    - **作用**：自定义拖拽开始的条件。返回 `true` 表示允许开始拖拽选择，`false` 则阻止拖拽。

19. **className**

    - **类型**：`string`
    - **默认值**：`''`
    - **作用**：为选择框元素添加自定义的 CSS 类名，方便进行样式定制。

20. **hoverClassName**

    - **类型**：`string`
    - **默认值**：`''`
    - **作用**：当元素被鼠标悬停或被选择时，添加到元素上的 CSS 类名。

21. **toggleContinueSelectWithoutDeselect**

    - **类型**：`boolean`
    - **默认值**：`false`
    - **作用**：在切换 `continueSelect` 状态时，是否保留已选中的元素而不取消选择。

22. **preventClickEvent**

    - **类型**：`boolean`
    - **默认值**：`true`
    - **作用**：是否在选择操作中阻止点击事件的触发，避免与其他点击交互冲突。

23. **appendTo**

    - **类型**：`HTMLElement | string`
    - **默认值**：`container`
    - **作用**：指定选择框元素添加到的容器。可用于调整选择框的层级关系。

24. **dragCondition**

    - **类型**：`function`
    - **默认值**：`null`
    - **作用**：自定义判断是否可以开始拖拽选择的条件函数。返回 `true` 允许拖拽，`false` 阻止拖拽。

**示例代码：**

```js
const selecto = new Selecto({
  container: document.querySelector(".selecto-area"),
  dragContainer: window,
  selectableTargets: [".selectable"],
  hitRate: 50,
  selectByClick: true,
  selectFromInside: false,
  continueSelect: false,
  toggleContinueSelect: "shift",
  keyContainer: window,
  ratio: 0,
  scrollOptions: {
    container: document.querySelector(".scroll-container"),
    threshold: 30,
    speed: 10,
  },
  boundContainer: document.querySelector(".bound-area"),
  preventDefault: true,
  cspNonce: "your-csp-nonce",
  checkInput: true,
  preventDragFromInside: false,
  getElementRect: el => {
    // 自定义获取元素位置的方法
    return {
      left: el.offsetLeft,
      top: el.offsetTop,
      width: el.offsetWidth,
      height: el.offsetHeight,
    }
  },
  className: "custom-selecto",
  hoverClassName: "selected",
  toggleContinueSelectWithoutDeselect: true,
  preventClickEvent: true,
  appendTo: document.body,
  dragCondition: e => {
    // 仅当按下左键时允许拖拽选择
    return e.inputEvent.button === 0
  },
})
```

通过正确配置以上选项，您可以根据具体需求定制 Selecto.js 的功能，例如：

- **多选功能**：使用 `continueSelect: true` 实现多次选择累加。
- **限制选择范围**：通过 `boundContainer` 限制选择框的活动区域。
- **自定义样式**：使用 `className` 和 `hoverClassName` 为选择框和被选中元素添加自定义样式。

**注意事项：**

- **事件监听**：Selecto.js 提供了丰富的事件回调，如 `select`, `dragStart`, `dragEnd`，可用于响应用户的选择操作。
- **性能优化**：在大量可选元素时，合理使用 `selectableTargets` 和 `getElementRect` 以提升性能。

希望以上解释能帮助您全面了解 Selecto.js 的配置选项，从而更好地应用到项目中。

## FAQ

### `dragContainer` 和 `container` 的区别

**深入理解 selecto.js 中 `container` 和 `dragContainer` 的区别**

在 `selecto.js` 中，`container` 和 `dragContainer` 都是用于配置选择行为的选项，但它们的作用不同。

---

#### **1. `container`**

- **类型**：`HTMLElement | string`
- **默认值**：`document.body`
- **作用**：定义选择操作的范围，以及可被选择的元素所在的区域。

`container` 是选择操作发生的区域，Selecto 会在这个容器内查找和选择元素。当您指定 `selectableTargets` 时，`selecto.js` 会在 `container` 内根据这些选择器查找目标元素。

**`container` 的关键点：**

- **操作范围**：它是 `selecto.js` 进行选择操作的主要区域。
- **元素定位**：所有可被选择的元素都应位于此容器内。
- **坐标计算**：选择框的位置和尺寸是基于该容器的坐标系计算的。
- **默认容器**：如果未指定，默认为 `document.body`。

---

#### **2. `dragContainer`**

- **类型**：`HTMLElement | string`
- **默认值**：如果未指定，则与 `container` 相同
- **作用**：指定监听鼠标或触摸事件以开始选择过程的区域或元素。

`dragContainer` 是用户可以开始拖拽以创建选择框的区域。换句话说，它是用户可以点击并拖动以开始选择的区域。

**`dragContainer` 的关键点：**

- **事件监听区域**：它是用于监听鼠标或触摸事件的区域。
- **选择启动**：用户只能在此区域内开始点击并拖动以进行选择。
- **可独立设置**：可以与 `container` 不同，允许在一个区域启动选择，但选择另一个区域内的元素。
- **用途多样**：可用于限制选择操作的启动区域，防止干扰其他交互。

---

#### **区别和使用场景**

**区别总结：**

- **`container`**：定义选择操作的目标区域和元素所在位置。
- **`dragContainer`**：定义用户可以开始拖拽选择的区域。

**使用场景：**

1. **默认行为（`container` 和 `dragContainer` 相同）**

   - 用户可以在容器内的任何位置开始拖拽选择。
   - 适用于简单的选择场景，没有特殊的交互限制。

2. **不同的 `container` 和 `dragContainer`**

   - **场景一**：防止干扰元素的正常交互
     - **示例**：在一个图片库中，您希望用户在图片上点击时查看大图，而不是开始选择。
     - **解决**：将 `dragContainer` 设置为不包含图片的区域，如空白背景。
   - **场景二**：从特定区域启动选择
     - **示例**：只有在按住某个按钮或在特定面板上拖拽时才开始选择。
     - **解决**：将 `dragContainer` 设置为该按钮或面板的元素选择器。

**示例代码：**

```js
const selecto = new Selecto({
  // 定义可被选择的元素所在的容器
  container: ".items-container",
  // 定义用户可以开始拖拽选择的区域
  dragContainer: ".selection-area",
  // 可被选择的元素
  selectableTargets: [".items-container .item"],
  // 其他配置...
})
```

**解释：**

- **`.items-container`**：包含了所有可被选择的项目。
- **`.selection-area`**：用户只能在此区域内开始拖拽选择。
- **结果**：避免了用户在与项目交互时（如点击、拖动项目）意外启动选择操作。

---

#### **总结**

- **`container`（容器）**：选择操作的范围，决定哪些元素可以被选择，以及选择框的位置计算。
- **`dragContainer`（拖拽容器）**：用户可以开始拖拽以进行选择的区域，决定了选择操作的触发区域。

通过正确配置这两个选项，您可以：

- **控制选择行为**：防止选择操作干扰其他交互（如点击、拖动元素本身）。
- **优化用户体验**：使选择操作更加直观，符合应用的交互逻辑。
- **增强功能**：实现复杂的交互需求，如在特定区域或条件下才允许选择。

**建议：**

- **根据需求设置**：如果不需要特殊的选择启动区域，保持默认配置即可。
- **测试交互效果**：在应用中测试不同配置，确保选择操作符合用户预期。

希望以上解释能帮助您充分理解 `container` 和 `dragContainer` 的区别，并在项目中灵活应用。
