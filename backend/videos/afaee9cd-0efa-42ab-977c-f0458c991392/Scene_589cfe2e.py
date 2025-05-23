
from manim import *

class Scene_589cfe2e(Scene):
    def construct(self):
        title = Text("Visualizing the Sine Wave", font_size=48).scale(0.7).to_edge(UP)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        axes = Axes(
        x_range=[-3*PI, 3*PI, PI/2],
        y_range=[-1.5, 1.5, 0.5],
        axis_config={"include_numbers": True}
        ).scale(0.7)
        self.play(Create(axes))
        sine_graph = axes.plot(lambda x: np.sin(x), color=BLUE)
        self.play(Create(sine_graph))
        explanation1 = Text("This is the graph of y = sin(x)", font_size=32).scale(0.7).next_to(axes, DOWN)
        self.play(Write(explanation1))
        self.wait(2)
        self.play(FadeOut(explanation1))
        unit_circle = Circle(radius=1, color=YELLOW).move_to(axes.coords_to_point(0,0))
        self.play(Create(unit_circle))
        dot = Dot(unit_circle.get_top(), color=RED)
        self.play(Create(dot))
        explanation2 = Text("Observe the relationship with the unit circle.", font_size=32).scale(0.7).next_to(axes, DOWN)
        self.play(Write(explanation2))
        self.wait(2)
        self.play(FadeOut(explanation2))
        x_tracker = ValueTracker(0)
        dot_movement = always_redraw(lambda : dot.move_to(unit_circle.point_at_angle(x_tracker.get_value())))
        sine_value_line = always_redraw(lambda: Line(axes.coords_to_point(x_tracker.get_value(), 0), axes.coords_to_point(x_tracker.get_value(), np.sin(x_tracker.get_value()))))
        self.play(Create(sine_value_line))
        self.play(x_tracker.animate.set_value(3*PI), run_time=5, rate_func=linear)
        self.wait(1)
        explanation3 = Text("The y-coordinate of the rotating point on the unit circle corresponds to the sine value.", font_size=32).scale(0.7).next_to(axes, DOWN)
        self.play(Write(explanation3))
        self.wait(3)
        self.play(FadeOut(explanation3), FadeOut(axes), FadeOut(sine_graph), FadeOut(unit_circle), FadeOut(dot), FadeOut(sine_value_line),)
