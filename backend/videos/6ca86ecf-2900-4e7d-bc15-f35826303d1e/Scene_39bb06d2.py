
from manim import *

class Scene_39bb06d2(Scene):
    def construct(self):
        owl = SVGMobject("owl").scale(2)
        self.play(Create(owl))
        self.wait(1)
        title = Text("Generating an Owl Image").scale(1.5)
        self.play(Write(title))
        self.wait(1)
        description = Text("We use Manim's SVGMobject to display vector graphics.").scale(0.7)
        self.play(TransformMatchingTex(title, description))
        self.wait(1)
        owl_parts_text = Text("Owl Parts").scale(1.2)
        owl_parts_text.next_to(owl, UP, buff=1)
        self.play(Write(owl_parts_text))
        self.wait(1)
        #Highlight parts (replace with actual part highlighting if you have a more complex SVG)
        rect = SurroundingRectangle(owl, buff=0.2)
        self.play(Create(rect), run_time=2)
        self.wait(1)
        self.play(Uncreate(rect))
        final_text = Text("This demonstrates how to import and display an SVG image using Manim.").scale(0.7)
        self.play(TransformMatchingTex(description, final_text))
        self.wait(2)
        self.play(FadeOut(owl), FadeOut(final_text))
