declare module "react-google-recaptcha-v2" {
  import { Component, ReactNode, Ref } from "react";

  interface ReCAPTCHAProps {
    sitekey: string;
    onChange: (token: string | null) => void;
    theme?: "light" | "dark";
    type?: "image" | "audio";
    tabindex?: number;
    onExpired?: () => void;
    onErrored?: () => void;
    size?: "compact" | "normal" | "invisible";
    stoken?: string;
    badge?: "bottomright" | "bottomleft" | "inline";
    hl?: string;
    isolated?: boolean;
    asyncScriptOnLoad?: () => void;
  }

  interface RecaptchaWrapperProps extends ReCAPTCHAProps {
    children?: ReactNode;
  }

  interface ReCAPTCHAInstance {
    getValue: () => string | null;
    getWidgetId: () => number | null;
    reset: () => void;
    execute: () => void;
    executeAsync: () => Promise<string>;
  }

  export default class RecaptchaWrapper extends Component<RecaptchaWrapperProps & { ref?: Ref<ReCAPTCHAInstance> }> {}
  export class ReCAPTCHA extends Component<ReCAPTCHAProps & { ref?: Ref<ReCAPTCHAInstance> }> {}
}
