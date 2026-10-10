# Nox hidden cinematic

A completed, unskipped original opening dispatches the existing `solaria:intro-finished` event. One independent cryptographic draw below 0.10 launches the film. Deep links, skipped openings and cancelled hidden films do not grant a new unlock. Previously unlocked browsers keep their unlock and still draw independently on opening completion. They also see “녹스 이벤트 다시 보기” beside the opening replay controls in the hero and footer; this explicitly requested replay starts the film directly without a probability draw. Locked browsers cannot use this replay.

The original opening shots and cues are unchanged. The sound controller adds `hiddenStart` / `hiddenEnd` hooks to pause and silence both original tracks during the hidden film. The MP3 media clock drives the film when playback is available; silent playback uses a monotonic clock with the same cues. Visibility changes pause the clock and preserve mute. Playback rejection, media errors or prolonged buffering fall back to the silent clock. Closing the film restores the original sound preference and page focus.

## Verified source timing

`ffprobe` reports 22.392 seconds; Chromium decodes approximately 22.36 seconds of playable audio. PCM envelope and STFT analysis (16 kHz mono) locate the crack transient around 4.30 seconds, speech-band onsets at 9.20 and 14.60 seconds, and the closing impact around 16.65 seconds. These are signal-derived alignments; the supplied Latin phrases were not independently transcribed by a speech model.

| Cue | Time (seconds) |
| --- | --- |
| CUT 01 — thin crack | 0.00 |
| CUT 02 — opening crack | 4.30 |
| CUT 03 — Nox | 9.18 |
| “Quis silentium rupit?” / 누가 침묵을 깨뜨렸느냐? | 9.20–11.25 |
| “Noli oculos avertere.” / 눈을 돌리지 마라. | 14.60–16.60 |
| CUT 04 — seal release | 16.65 |
| Record unlock and navigation | Audio end / 22.392 |

Images use `object-fit: contain` without changing their ratios. Motion-reduction preferences remove fades and movement. The dialog traps keyboard focus and restores the previous inert state of the underlying page.

The existing `solaria-noctis-contact-v1 = linked` key is written only on completion. Public Rift dossiers and constellation records use the existing unlock flag. No Nox–Umbra relationship or hidden identity is added.

## Checks

With Python Playwright and `/usr/bin/chromium` installed:

```sh
python3 tests/test_nox_film.py
python3 tests/test_nox_audio.py
python3 tests/test_nox_audio.py --mobile
```

Each test starts its own local read-only HTTP server with byte-range support. The silent tests advance the browser clock through the complete original opening and hidden-film cues. The audio test advances the original audio clock for the transition and seeks the real hidden MP3 to exercise playback-clock synchronization, audio isolation, mute preservation and background restoration. Controlled draws exist only in these tests; the production event has no forced-unlock or probability override.
