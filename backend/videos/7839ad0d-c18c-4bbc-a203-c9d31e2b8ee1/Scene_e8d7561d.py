
from manim import *

class Scene_e8d7561d(Scene):
    def construct(self):
        self.camera.background_color = "#ece6e2"  #Creamy background
        title = Text("Constructing an Owl with Manim", font_size=36).scale(1.2)
        self.play(Write(title))
        self.wait(1)
        self.play(FadeOut(title))
        # Body
        body = Circle(radius=1.5, fill_opacity=1, fill_color= "#A0522D").shift(UP*0.5)
        self.play(Create(body))
        self.wait(0.5)
        body_text = Text("Body: A simple circle").next_to(body, DOWN)
        self.play(Write(body_text))
        self.wait(1)
        self.play(FadeOut(body_text))
        #Head
        head = Circle(radius=1, fill_opacity=1, fill_color="#A0522D").shift(UP*2)
        self.play(Create(head))
        self.wait(0.5)
        head_text = Text("Head: Another circle").next_to(head, DOWN)
        self.play(Write(head_text))
        self.wait(1)
        self.play(FadeOut(head_text))
        #Eyes
        eye1 = Circle(radius=0.2, fill_opacity=1, fill_color=BLACK).shift(UP*2 + LEFT*0.5)
        eye2 = Circle(radius=0.2, fill_opacity=1, fill_color=BLACK).shift(UP*2 + RIGHT*0.5)
        self.play(Create(eye1), Create(eye2))
        eyes_text = Text("Eyes: Small circles").next_to(eye1, DOWN)
        self.play(Write(eyes_text))
        self.wait(1)
        self.play(FadeOut(eyes_text))
        #Beak
        beak = Triangle(fill_opacity=1, fill_color= "#FFA500").shift(UP*1.5 + DOWN*0.2)
        self.play(Create(beak))
        beak_text = Text("Beak: A simple triangle").next_to(beak, DOWN)
        self.play(Write(beak_text))
        self.wait(1)
        self.play(FadeOut(beak_text))
        #Wings
        wing1 = Polygon(
        [-0.5, -1.5, 0],
        [-0.5, -1.5, -1.5],
        [-0.5, -1, 0]
        ).shift(LEFT*1.5 + DOWN*0.5).set_fill(color="#A0522D", opacity=1)
        wing2 = wing1.copy().shift(RIGHT * 3)
        self.play(Create(wing1), Create(wing2))
        wings_text = Text("Wings: Polygons").next_to(wing1, DOWN)
        self.play(Write(wings_text))
        self.wait(1)
        self.play(FadeOut(wings_text))
        #Talons
        talon1 = Triangle(fill_opacity=1, fill_color=BLACK).shift(DOWN*2.5 + LEFT*0.5)
        talon2 = Triangle(fill_opacity=1, fill_color=BLACK).shift(DOWN*2.5 + RIGHT*0.5)
        self.play(Create(talon1), Create(talon2))
        talons_text = Text("Talons: Triangles").next_to(talon1, DOWN)
        self.play(Write(talons_text))
        self.wait(1)
        self.play(FadeOut(talons_text))
        final_text = Text("Owl Complete!", font_size=30).scale(1.2)
        self.play(Write(final_text))
        self.wait(2)
        self.play(FadeOut(final_text))
