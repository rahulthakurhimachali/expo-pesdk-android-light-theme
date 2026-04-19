import { withAndroidManifest, withAndroidStyles, withDangerousMod } from "@expo/config-plugins";
import type { ExpoConfig } from "expo/config";
import type { AndroidManifest } from "@expo/config-plugins";
import fs from "node:fs";
import path from "node:path";

// ─── 1. imgly_color.xml — light theme color overrides ────────────────────────
// Values taken directly from the official PESDK React Native theming docs:
// https://img.ly/docs/pesdk/react-native/guides/user-interface/theming/
// These override the dark defaults that PESDK ships with.

const IMGLY_COLORS_XML = `<?xml version="1.0" encoding="utf-8"?>
<resources>
  <color name="imgly_transparent_color">#00000000</color>
  <color name="imgly_background_color">#EBEBEB</color>
  <color name="imgly_camera_header_background_color">#27000000</color>
  <color name="imgly_camera_footer_background_color">#27000000</color>
  <color name="imgly_highlight_color">#FF1B77FF</color>
  <color name="imgly_icon_border_color_active">#FF1B77FF</color>
  <color name="imgly_slider_track_color_progress">#FF1B77FF</color>
  <color name="imgly_text_color">#FF000000</color>
  <color name="imgly_editor_text_color">#FF000000</color>
  <color name="imgly_camera_text_color">#FFFFFFFF</color>
  <color name="imgly_text_color_active">#FF000000</color>
  <color name="imgly_sprite_handle_thumb_color">#FFFFFFFF</color>
  <color name="imgly_text_on_image_color">#FFFFFFFF</color>
  <color name="imgly_icon_color_active">#FF000000</color>
  <color name="imgly_shuffle_icon_color">#FF000000</color>
  <color name="imgly_text_on_image_color_secondary">#99FFFFFF</color>
  <color name="imgly_button_color">#00000000</color>
  <color name="imgly_button_color_pressed">#FF203E61</color>
  <color name="imgly_button_color_disabled">#CCCCCCCC</color>
  <color name="imgly_icon_color">#CC000000</color>
  <color name="imgly_editor_text_color_secondary">#99000000</color>
  <color name="imgly_slider_thumb_color_disabled">#66000000</color>
  <color name="imgly_icon_color_disabled">#66000000</color>
  <color name="imgly_crop_icon_fill_color_active">#33000000</color>
  <color name="imgly_crop_icon_fill_color">#29000000</color>
  <color name="imgly_slider_track_color">#99000000</color>
  <color name="imgly_text_input_background_color">#D9000000</color>
  <color name="imgly_sticker_selection_background_color">#D9000000</color>
  <color name="imgly_actionBar_background_color">#FFFFFF</color>
  <color name="imgly_optionToolBar_background_color">#F7F7F7</color>
  <color name="imgly_slider_thumb_color">#FFE3E3E3</color>
  <color name="imgly_slider_background_color">#FFE3E3E3</color>
  <color name="imgly_quickOptionToolBar_background_color">#4D000000</color>
  <color name="imgly_dialog_background_color">#DDE3E3E3</color>
  <color name="imgly_shuffle_icon_overlay_color">#DDE3E3E3</color>
  <color name="imgly_text_on_image_background_color">#99000000</color>
  <color name="imgly_sprite_handle_line_color">#80FFFFFF</color>
  <color name="imgly_brush_preview_background_color">#DD1C1C1C</color>
  <color name="imgly_icon_color_on_canvas">#FFFFFFFF</color>
  <color name="imgly_icon_color_on_canvas_disabled">#66FFFFFF</color>
  <color name="imgly_icon_color_secondary">#99000000</color>
  <color name="imgly_camera_background_color">#FF000000</color>
  <color name="imgly_camera_icon_color">#CCFFFFFF</color>
  <color name="imgly_transform_background_color">#80000000</color>
</resources>
`;

// ─── 2. AndroidManifest — windowBackground override ──────────────────────────
// Fixes the dark flash during the Android activity launch transition.
// PESDK's default Theme.Imgly has a dark windowBackground which Android renders
// before PESDK draws its first frame. We override it to white here.

const PESDK_ACTIVITY_NAME = "ly.img.react_native.pesdk.RNPhotoEditorSDKActivity";
const PESDK_THEME_NAME = "Theme.App.PESDK";
const PESDK_THEME_PARENT = "Theme.Imgly.Light";
const PESDK_THEME_ITEMS: Record<string, string> = {
  "android:windowBackground": "@color/pesdk_window_background",
};
const PESDK_BACKGROUND_COLOR = "#ffffff";

function ensurePESDKActivityTheme(androidManifest: AndroidManifest): AndroidManifest {
  const application = androidManifest.manifest.application?.[0];
  if (!application) return androidManifest;

  application.activity = application.activity ?? [];

  const existingActivity = application.activity.find(
    activity => activity?.$?.["android:name"] === PESDK_ACTIVITY_NAME
  );

  if (!existingActivity) {
    application.activity.push({
      $: {
        "android:name": PESDK_ACTIVITY_NAME,
        "android:theme": `@style/${PESDK_THEME_NAME}`,
        "tools:replace": "android:theme",
      },
    });
    return androidManifest;
  }

  existingActivity.$ = existingActivity.$ ?? {};
  existingActivity.$["android:theme"] = `@style/${PESDK_THEME_NAME}`;
  existingActivity.$["tools:replace"] = "android:theme";
  return androidManifest;
}

function ensurePESDKStyle(stylesXml: any): any {
  stylesXml.resources = stylesXml.resources ?? {};
  stylesXml.resources.style = stylesXml.resources.style ?? [];

  let pesdkTheme = stylesXml.resources.style.find((s: any) => s?.$?.name === PESDK_THEME_NAME);
  if (!pesdkTheme) {
    pesdkTheme = { $: { name: PESDK_THEME_NAME, parent: PESDK_THEME_PARENT }, item: [] };
    stylesXml.resources.style.push(pesdkTheme);
  }

  pesdkTheme.$.parent = PESDK_THEME_PARENT;
  pesdkTheme.item = pesdkTheme.item ?? [];

  for (const [itemName, itemValue] of Object.entries(PESDK_THEME_ITEMS)) {
    const existing = pesdkTheme.item.find((i: any) => i?.$?.name === itemName);
    if (existing) {
      existing._ = itemValue;
    } else {
      pesdkTheme.item.push({ $: { name: itemName }, _: itemValue });
    }
  }

  stylesXml.resources.color = stylesXml.resources.color ?? [];
  const existingColor = stylesXml.resources.color.find((c: any) => c?.$?.name === "pesdk_window_background");
  if (existingColor) {
    existingColor._ = PESDK_BACKGROUND_COLOR;
  } else {
    stylesXml.resources.color.push({ $: { name: "pesdk_window_background" }, _: PESDK_BACKGROUND_COLOR });
  }

  return stylesXml;
}

export default function withPESDKTheme(config: ExpoConfig): ExpoConfig {
  config = withDangerousMod(config, [
    "android",
    async config => {
      const colorsPath = path.join(
        config.modRequest.platformProjectRoot,
        "app",
        "src",
        "main",
        "res",
        "values",
        "imgly_color.xml"
      );
      fs.writeFileSync(colorsPath, IMGLY_COLORS_XML, "utf8");
      return config;
    },
  ]);

  config = withAndroidManifest(config, config => {
    config.modResults = ensurePESDKActivityTheme(config.modResults);
    return config;
  });

  config = withAndroidStyles(config, config => {
    config.modResults = ensurePESDKStyle(config.modResults);
    return config;
  });

  return config;
}
