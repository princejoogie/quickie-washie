import { WIDTH } from "../constants";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import Animated, {
  interpolateColor,
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import tailwind from "tailwind-rn";
import { PanGestureHandler } from "react-native-gesture-handler";

interface ExpandProps {}

const TestRN: React.FC<ExpandProps> = () => {
  const width = useSharedValue(50);
  const height = useSharedValue(50);
  const color = useSharedValue(0);

  const x = useSharedValue(0);
  const y = useSharedValue(0);

  const gestureHandler = useAnimatedGestureHandler({
    onStart: (_, ctx: any) => {
      ctx.startX = x.value;
      ctx.startY = y.value;
    },
    onActive: (event, ctx) => {
      x.value = ctx.startX + event.translationX;
      y.value = ctx.startY + event.translationY;
    },
    onEnd: (_) => {
      x.value = withSpring(0);
      y.value = withSpring(0);
    },
  });

  const styles = useAnimatedStyle(() => ({
    width: withSpring(width.value),
    height: withSpring(height.value),
    backgroundColor: withTiming(
      interpolateColor(color.value, [0, 1], ["#DBEAFE", "#1E3A8A"])
    ),
    transform: [{ translateX: x.value }, { translateY: y.value }],
  }));

  return (
    <View style={tailwind("flex flex-1 items-center justify-center")}>
      <View
        style={tailwind(
          "absolute inset-x-0 top-0 flex flex-row justify-evenly py-4"
        )}
      >
        <TouchableOpacity
          onPress={() => {
            width.value = Math.min(
              WIDTH - 10,
              Math.max(50, Math.random() * WIDTH)
            );
          }}
          style={tailwind("px-4 py-2 bg-gray-300 rounded")}
        >
          <Text>Width</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => {
            height.value = Math.max(50, Math.random() * WIDTH);
          }}
          style={tailwind("px-4 py-2 bg-gray-300 rounded")}
        >
          <Text>Height</Text>
        </TouchableOpacity>
      </View>

      <PanGestureHandler onGestureEvent={gestureHandler}>
        <Animated.View
          onTouchStart={() => {
            color.value = Math.random();
          }}
          style={[styles, tailwind("rounded-xl bg-red-500")]}
        />
      </PanGestureHandler>
    </View>
  );
};

export default TestRN;
