
from manim import *

class Scene_30fca85b(Scene):
    def construct(self):
        self.wait(1)
        title = Text("Constructing a Right-Angled Triangle").scale(1.2)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        # Draw the base
        base = Line(ORIGIN, 3 * RIGHT)
        base_label = MathTex("a").next_to(base, DOWN)
        self.play(Create(base), Write(base_label))
        self.wait(1)
        # Add explanation text for the base
        base_text = Text("First, we draw the base of length 'a'").scale(0.7).next_to(base, DOWN, buff=0.5)
        self.play(Write(base_text))
        self.wait(1)
        self.play(FadeOut(base_text))
        # Draw the height
        height = Line(3 * RIGHT, 3 * RIGHT + 2 * UP)
        height_label = MathTex("b").next_to(height, RIGHT)
        self.play(Create(height), Write(height_label))
        self.wait(1)
        # Add explanation text for the height
        height_text = Text("Next, we draw the height 'b', perpendicular to the base").scale(0.7).next_to(height, RIGHT, buff=0.5)
        self.play(Write(height_text))
        self.wait(1)
        self.play(FadeOut(height_text))
        # Complete the triangle
        hypotenuse = Line(ORIGIN, 3 * RIGHT + 2 * UP)
        hypotenuse_label = MathTex("c = \\sqrt{a^2 + b^2}").next_to(hypotenuse, UP, buff=0.3)
        self.play(Create(hypotenuse), Write(hypotenuse_label))
        self.wait(1)
        # Highlight the right angle
        right_angle = RightAngle(base, height, quadrant=(1,1))
        self.play(Create(right_angle))
        self.wait(1)
        # Final explanation
        final_text = Text("We've constructed a right-angled triangle with sides a, b, and hypotenuse c, satisfying the Pythagorean theorem: $c^2 = a^2 + b^2$").scale(0.7)
        self.play(Write(final_text))
        self.wait(3)
