import type { CuriosityAudioBlock } from "@/types/curiosity-experience";
import { isValidAudioUrl } from "@/lib/audio/is-valid-audio-url";

/**
 * A topic is "audio-ready" for Listen Mode when it has a valid HTTP(S) audio_url
 * (represented here as a populated {@link CuriosityAudioBlock} from the loader).
 */
export function isAudioAvailable(
  audio: CuriosityAudioBlock | null | undefined
): boolean {
  if (audio == null) return false;
  return isValidAudioUrl(audio.audioUrl);
}
