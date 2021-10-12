import Int0DValue from "./int-0d";
import Int1DValue from "./int-1d";
import Int2DValue from "./int-2d";
import Int3DValue from "./int-3d";
import IntChar0DValue from "./int-char-0d";
import IntChar1DValue from "./int-char-1d";
import RandValue from "./rand";
import Str0DValue from "./str-0d";
import Str1DValue from "./str-1d";
import StrChar0DValue from "./str-char-0d";
import StrChar1DValue from "./str-char-1d";
export default class Value {
    static Rand(_data, name) {
        return new RandValue(name);
    }
    static Int0D(_data, name) {
        return new Int0DValue(name);
    }
    static Str0D(_data, name) {
        return new Str0DValue(name);
    }
    static Int1D(data, name, size = 1000) {
        return new Int1DValue(name, data.varSize.get(name) ?? size);
    }
    static Str1D(data, name, size = 100) {
        return new Str1DValue(name, data.varSize.get(name) ?? size);
    }
    static Int2D(_data, name, size0 = 100, size1 = 100) {
        // TODO: Get varsize from data
        return new Int2DValue(name, size0, size1);
    }
    static Int3D(_data, name, size0 = 100, size1 = 100, size2 = 100) {
        // TODO: Get varsize from data
        return new Int3DValue(name, size0, size1, size2);
    }
    static IntChar0D(_data, name) {
        return new IntChar0DValue(name);
    }
    static StrChar0D(_data, name) {
        return new StrChar0DValue(name);
    }
    static IntChar1D(data, name, size = 1000) {
        return new IntChar1DValue(name, data.varSize.get(name) ?? size);
    }
    static StrChar1D(data, name, size = 100) {
        return new StrChar1DValue(name, data.varSize.get(name) ?? size);
    }
}
