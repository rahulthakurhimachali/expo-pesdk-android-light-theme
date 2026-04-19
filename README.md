# expo-pesdk-android-light-theme

An [Expo config plugin](https://docs.expo.dev/config-plugins/introduction/) that applies a **light theme** to [PhotoEditor SDK](https://img.ly/photo-editor-sdk) on Android and eliminates the dark launch-transition flash.

## The problem

PESDK ships with a dark theme by default (`Theme.Imgly`). On Android, this causes two issues:

1. The entire editor UI is dark - there is no built-in way to switch to a light theme from JavaScript.
2. A dark screen flashes during the activity launch transition because PESDK's `windowBackground` is dark.

This plugin fixes both automatically at build time via Expo's managed config system - no native code edits required.

## What it does

| Step | What gets changed |
|------|------------------|
| Writes `imgly_color.xml` | Overrides all PESDK color tokens to light-theme values |
| Patches `AndroidManifest.xml` | Points `RNPhotoEditorSDKActivity` to a custom `Theme.App.PESDK` style |
| Patches `styles.xml` | Adds `Theme.App.PESDK` extending `Theme.Imgly.Light` with a white `windowBackground` |

## Installation

```sh
npm install expo-pesdk-android-light-theme
```

Add the plugin to your `app.json`:

```json
{
  "expo": {
    "plugins": [
      "expo-pesdk-android-light-theme"
    ]
  }
}
```

Then rebuild your native app:

```sh
npx expo run:android
```

> This plugin is Android-only. It has no effect on iOS.

## Requirements

- Expo SDK 49 or later
- [`react-native-photoeditorsdk`](https://github.com/imgly/pesdk-react-native) already installed and configured via `react-native-imglysdk`
- A valid PESDK license (trial or paid) from [img.ly](https://img.ly)

## Example

A full working example is in the [`example/`](./example) directory.

```ts
import { PESDK } from "react-native-photoeditorsdk";

const result = await PESDK.openEditor(
  require("./assets/photo.jpg")
);

if (result) {
  console.log("Edited image URI:", result.image);
}
```

## Color tokens

All overridden colors live in `imgly_color.xml` and follow the [official PESDK theming reference](https://img.ly/docs/pesdk/react-native/guides/user-interface/theming/). The key overrides:

| Token | Value | Purpose |
|-------|-------|---------|
| `imgly_background_color` | `#EBEBEB` | Main editor background |
| `imgly_actionBar_background_color` | `#FFFFFF` | Bottom toolbar background |
| `imgly_optionToolBar_background_color` | `#F7F7F7` | Options panel background |
| `imgly_text_color` | `#FF000000` | Primary text - black |
| `imgly_icon_color` | `#CC000000` | Icons - dark |
| `imgly_highlight_color` | `#FF1B77FF` | Active/selected accent |

## License

MIT - see [LICENSE](./LICENSE)

## Report Issues

Open issues at: https://github.com/rahulthakurhimachali/expo-pesdk-android-light-theme/issues

> PESDK itself requires a separate commercial license from [img.ly](https://img.ly/photo-editor-sdk/pricing).
