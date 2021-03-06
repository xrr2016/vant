import { createNamespace, addUnit } from '../utils';
import { BORDER } from '../utils/constant';
import { ChildrenMixin } from '../mixins/relation';
import { route, routeProps } from '../utils/router';
import Icon from '../icon';
import Info from '../info';

const [createComponent, bem] = createNamespace('grid-item');

export default createComponent({
  mixins: [ChildrenMixin('vanGrid')],

  props: {
    ...routeProps,
    dot: Boolean,
    text: String,
    icon: String,
    info: [Number, String]
  },

  computed: {
    style() {
      const { square, gutter, columnNum } = this.parent;
      const percent = `${100 / columnNum}%`;

      const style = {
        flexBasis: percent
      };

      if (square) {
        style.paddingTop = percent;
      } else if (gutter) {
        const gutterValue = addUnit(gutter);
        style.paddingRight = gutterValue;

        if (this.index >= columnNum) {
          style.marginTop = gutterValue;
        }
      }

      return style;
    },

    contentStyle() {
      const { square, gutter } = this.parent;

      if (square && gutter) {
        const gutterValue = addUnit(gutter);

        return {
          right: gutterValue,
          bottom: gutterValue,
          height: 'auto'
        };
      }
    }
  },

  methods: {
    onClick(event) {
      this.$emit('click', event);
      route(this.$router, this);
    },

    renderContent() {
      const slot = this.slots();

      if (slot) {
        return slot;
      }

      return [
        <div style="display: flex; position: relative">
          {this.slots('icon') ||
            (this.icon && (
              <Icon name={this.icon} size={this.parent.iconSize} class={bem('icon')} />
            ))}
          <Info dot={this.dot} info={this.info} />
        </div>,
        this.slots('text') || (this.text && <span class={bem('text')}>{this.text}</span>)
      ];
    }
  },

  render() {
    const { center, border, square, gutter, clickable } = this.parent;

    return (
      <div class={[bem({ square })]} style={this.style}>
        <div
          style={this.contentStyle}
          role={clickable ? 'button' : null}
          tabindex={clickable ? 0 : null}
          class={[
            bem('content', {
              center,
              square,
              clickable,
              surround: border && gutter
            }),
            { [BORDER]: border }
          ]}
          onClick={this.onClick}
        >
          {this.renderContent()}
        </div>
      </div>
    );
  }
});
