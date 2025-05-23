
from manim import *

class Scene_82d9f47d(Scene):
    def construct(self):
        title = Text("Constructing a Right-Angled Triangle", font_size=36).scale(0.7)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        # Step 1: Draw the base
        base = Line(ORIGIN, 3 * RIGHT, color=BLUE)
        base_label = MathTex("a").next_to(base, DOWN)
        self.play(Create(base), Write(base_label))
        intro_text1 = Text("First, we draw the base of our triangle.", font_size=24).to_corner(UL)
        self.play(Write(intro_text1))
        self.wait(1)
        self.play(FadeOut(intro_text1))
        # Step 2: Draw the height
        height = Line(3 * RIGHT, 3 * RIGHT + 2 * UP, color=GREEN)
        height_label = MathTex("b").next_to(height, RIGHT)
        self.play(Create(height), Write(height_label))
        intro_text2 = Text("Next, we draw the height, perpendicular to the base.", font_size=24).to_corner(UL)
        self.play(Write(intro_text2))
        self.wait(1)
        self.play(FadeOut(intro_text2))
        #Step 3: Connect to form the hypotenuse
        hypotenuse = Line(ORIGIN, 3 * RIGHT + 2 * UP, color=RED)
        hypotenuse_label = MathTex("c").next_to(hypotenuse, UR)
        self.play(Create(hypotenuse), Write(hypotenuse_label))
        intro_text3 = Text("Finally, connecting the ends gives us the hypotenuse.", font_size=24).to_corner(UL)
        self.play(Write(intro_text3))
        self.wait(1)
        self.play(FadeOut(intro_text3))
        # Step 4: Highlight the right angle
        right_angle = RightAngle(base, height, color=YELLOW)
        self.play(Create(right_angle))
        self.wait(2)
        #Step 5: Pythagorean theorem
        theorem = MathTex("a^2 + b^2 = c^2").scale(1.2).to_corner(DR)
        self.play(Write(theorem))
        self.wait(3)
