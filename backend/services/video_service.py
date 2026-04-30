import os
from moviepy.editor import VideoFileClip, TextClip, CompositeVideoClip, ColorClip, AudioFileClip, concatenate_videoclips
import moviepy.video.fx.all as vfx

def process_video(input_path: str, output_path: str, plan: dict):
    """
    Processes a video based on the AI generated plan.
    """
    try:
        clip = VideoFileClip(input_path)

        # 1. Basic Editing: Cuts and Trims
        trim_sections = plan.get("basic_editing", {}).get("trim_sections", [])
        if trim_sections:
            clips = []
            for section in trim_sections:
                if isinstance(section, (list, tuple)) and len(section) == 2:
                    clips.append(clip.subclip(section[0], section[1]))
            if clips:
                clip = concatenate_videoclips(clips)

        # 2. Format: Aspect Ratio
        target_ratio = plan.get("format", {}).get("aspect_ratio", "16:9")
        if target_ratio == "9:16":
            target_w = clip.h * 9 / 16
            clip = clip.crop(x_center=clip.w/2, width=target_w)
        elif target_ratio == "1:1":
            side = min(clip.w, clip.h)
            clip = clip.crop(x_center=clip.w/2, y_center=clip.h/2, width=side, height=side)

        # 3. Visual System
        brightness = plan.get("visual", {}).get("brightness", "")
        if "high" in str(brightness).lower():
            clip = clip.fx(vfx.colorx, 1.2)
        elif "low" in str(brightness).lower():
            clip = clip.fx(vfx.colorx, 0.8)

        # 4. Text Overlays
        text_elements = []
        text_overlays = plan.get("text_overlays", [])
        if plan.get("captions", {}).get("enabled"):
            if not text_overlays:
                text_overlays.append({
                    "text": "Auto-captions enabled",
                    "timing": "0-2",
                    "position": plan.get("captions", {}).get("position", "bottom")
                })

        for item in text_overlays:
            txt = item.get("text", "")
            if not txt: continue

            timing = item.get("timing", "0-2")
            try:
                start, end = map(float, str(timing).split("-"))
            except:
                start, end = 0, 2

            try:
                txt_clip = TextClip(txt, fontsize=50, color='white', font='Arial')
                txt_clip = txt_clip.set_start(start).set_duration(end - start)

                pos = item.get("position", "center").lower()
                if "bottom" in pos:
                    txt_clip = txt_clip.set_position(('center', 'bottom'))
                elif "top" in pos:
                    txt_clip = txt_clip.set_position(('center', 'top'))
                else:
                    txt_clip = txt_clip.set_position('center')

                text_elements.append(txt_clip)
            except Exception as te:
                print(f"TextClip error: {te}")

        if text_elements:
            clip = CompositeVideoClip([clip] + text_elements)

        # 5. Audio System
        original_vol = plan.get("audio", {}).get("volume", "normal")
        if "low" in str(original_vol).lower():
            clip = clip.volumex(0.5)
        elif "high" in str(original_vol).lower():
            clip = clip.volumex(1.5)

        # 6. Final Export
        clip.write_videofile(output_path, codec="libx264", audio_codec="aac")

        return output_path
    except Exception as e:
        print(f"Error processing video: {e}")
        raise e
    finally:
        if 'clip' in locals():
            clip.close()
