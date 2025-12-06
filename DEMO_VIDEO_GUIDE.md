# Demo Video Guide - No Face or Voice Required

This guide shows you how to create a professional demo video without showing your face or using your voice.

## Quick Overview

**What you need:**

- Screen recording software (built-in Windows Game Bar or OBS Studio)
- Video editor for text overlays (Clipchamp or DaVinci Resolve)
- 30-60 minutes of time

**What you'll create:**

- 2-4 minute video showing your project in action
- Text overlays explaining each step
- Optional background music
- Upload to YouTube (unlisted) or Vimeo

## Option 1: Windows Game Bar (Easiest - Built-in)

### Step 1: Prepare Your Terminal

Open PowerShell or Command Prompt and navigate to your project:

```bash
cd D:\Project\zama
```

### Step 2: Start Recording

1. Press `Win + G` to open Game Bar
2. Click the record button (or press `Win + Alt + R`)
3. Your screen is now recording

### Step 3: Execute Demo Commands

Run these commands one by one (pause 2-3 seconds between each):

```bash
git clone https://github.com/azrim/fhevm-examples-generator
cd fhevm-examples-generator
npm ci
npm run cli basic-counter -- --contractTemplate templates/contracts/basic-counter.sol --testTemplate templates/tests/basic-counter.test.ts
cd scaffolded/basic-counter
npm test
cd ../..
npm run scaffold:all
cat summary.txt
cat deliverables.json
```

### Step 4: Stop Recording

Press `Win + Alt + R` to stop recording. Video saved to `C:\Users\YourName\Videos\Captures\`

### Step 5: Add Text Overlays

**Using Clipchamp (Free, Windows 11):**

1. Open Clipchamp (search in Start menu)
2. Import your video
3. Add text overlays for each section:
   - "FHEVM Examples Generator"
   - "Step 1: Clone and Setup"
   - "Step 2: Scaffold Example"
   - "Step 3: Run Tests"
   - "Step 4: Scaffold All Examples"
   - "Step 5: View Results"
   - "Complete! 8 Examples Ready"

4. Export video (1080p recommended)

### Step 6: Upload to YouTube

1. Go to https://youtube.com/upload
2. Upload your video
3. Set visibility to "Unlisted"
4. Copy the video link
5. Use this link in your bounty submission

## Option 2: OBS Studio (More Professional)

### Installation

Download OBS Studio: https://obsproject.com/

### Recording Steps

1. Open OBS Studio
2. Add source: "Display Capture" or "Window Capture"
3. Click "Start Recording"
4. Run your demo commands
5. Click "Stop Recording"
6. Video saved to `C:\Users\YourName\Videos\`

### Add Text with DaVinci Resolve (Free)

1. Download: https://www.blackmagicdesign.com/products/davinciresolve
2. Import your video
3. Add text overlays on timeline
4. Export video

## Option 3: Terminal Recording (No Video Editing Needed)

### Using asciinema

```bash
npm install -g asciinema
asciinema rec demo.cast
```

Run your commands, then:

```bash
asciinema upload demo.cast
```

You'll get a shareable link like: `https://asciinema.org/a/xxxxx`

**Note:** This only shows terminal, not full screen. Good for technical audiences.

## Demo Script (2-4 Minutes)

### Section 1: Introduction (5 seconds)

**Text Overlay:** "FHEVM Examples Generator - Automated Scaffolding for FHEVM Examples"

### Section 2: Clone and Setup (15 seconds)

**Text Overlay:** "Step 1: Clone and Setup"

```bash
git clone https://github.com/azrim/fhevm-examples-generator
cd fhevm-examples-generator
npm ci
```

**Speed up this part 2x in editing**

### Section 3: Scaffold Single Example (20 seconds)

**Text Overlay:** "Step 2: Scaffold a Single Example"

```bash
npm run cli basic-counter -- --contractTemplate templates/contracts/basic-counter.sol --testTemplate templates/tests/basic-counter.test.ts
```

### Section 4: Run Tests (20 seconds)

**Text Overlay:** "Step 3: Run Tests"

```bash
cd scaffolded/basic-counter
npm test
```

**Text Overlay:** "✓ 9 tests passing"

### Section 5: Scaffold All Examples (30 seconds)

**Text Overlay:** "Step 4: Scaffold All 8 Examples"

```bash
cd ../..
npm run scaffold:all
```

**Speed up this part 4x in editing**

### Section 6: View Results (15 seconds)

**Text Overlay:** "Step 5: View Results"

```bash
cat summary.txt
```

**Text Overlay:** "✓ 8 examples created successfully"

```bash
cat deliverables.json
```

### Section 7: Features Summary (10 seconds)

**Text Overlay:**

```
Key Features:
✓ 8 working examples
✓ 60+ passing tests
✓ Automated documentation
✓ GitBook-compatible output
✓ Performance optimized
✓ Full git history preservation
```

### Section 8: Closing (5 seconds)

**Text Overlay:**

```
GitHub: github.com/azrim/fhevm-examples-generator
Thank you!
```

## Quick 2-Minute Version

If you want a shorter video, record only this:

```bash
cd fhevm-examples-generator
npm run cli basic-counter -- --contractTemplate templates/contracts/basic-counter.sol --testTemplate templates/tests/basic-counter.test.ts
cd scaffolded/basic-counter
npm test
cd ../..
npm run scaffold:all
cat summary.txt
```

Add text overlays:

1. "Scaffolding example..."
2. "Tests passing ✓"
3. "Scaffolding all 8 examples..."
4. "Complete!"

## All Commands in One Block (Copy-Paste Ready)

```bash
git clone https://github.com/azrim/fhevm-examples-generator
cd fhevm-examples-generator
npm ci
npm run cli basic-counter -- --contractTemplate templates/contracts/basic-counter.sol --testTemplate templates/tests/basic-counter.test.ts
cd scaffolded/basic-counter
npm test
cd ../..
npm run scaffold:all
cat summary.txt
cat deliverables.json
ls scaffolded
```

## Background Music (Optional)

**Royalty-free music sources:**

- YouTube Audio Library: https://studio.youtube.com/
- Incompetech: https://incompetech.com/music/royalty-free/
- Bensound: https://www.bensound.com/

**Recommended tracks:**

- "Inspiring" or "Tech" category
- Instrumental only
- Low volume (background only)

## Video Hosting Options

### YouTube (Recommended)

1. Go to https://youtube.com/upload
2. Upload video
3. Title: "FHEVM Examples Generator - Demo"
4. Description: "Automated scaffolding tool for FHEVM examples. GitHub: https://github.com/azrim/fhevm-examples-generator"
5. Visibility: **Unlisted** (not public, but anyone with link can view)
6. Copy link for submission

### Vimeo

1. Go to https://vimeo.com/upload
2. Upload video
3. Set privacy to "Anyone with link"
4. Copy link

### Streamable

1. Go to https://streamable.com/
2. Upload video (no account needed)
3. Copy link

### Google Drive

1. Upload to Google Drive
2. Right-click → Share → "Anyone with link can view"
3. Copy link

## Tips for Better Video

### Do:

- ✓ Clear terminal font (increase size if needed)
- ✓ Clean desktop background
- ✓ Pause 2-3 seconds between commands
- ✓ Use text overlays to explain what's happening
- ✓ Speed up slow parts (npm install, scaffolding)
- ✓ Show successful results clearly

### Don't:

- ✗ Rush through commands
- ✗ Show errors without explanation
- ✗ Include personal information on screen
- ✗ Make video too long (keep under 5 minutes)

## Troubleshooting

### "Game Bar won't open"

- Enable Game Bar in Settings → Gaming → Game Bar
- Or use OBS Studio instead

### "Video file too large"

- Compress with HandBrake: https://handbrake.fr/
- Or upload to YouTube (they compress automatically)

### "Text overlays look bad"

- Use simple fonts (Arial, Helvetica)
- White text with black outline
- Keep text on screen for 3-5 seconds

### "Commands run too fast"

- Add `timeout /t 2` (Windows) or `sleep 2` (Linux) between commands
- Or slow down video in editing

## Example Timeline

```
0:00 - 0:05   Title screen
0:05 - 0:20   Clone and setup (sped up 2x)
0:20 - 0:40   Scaffold single example
0:40 - 1:00   Run tests
1:00 - 1:30   Scaffold all examples (sped up 4x)
1:30 - 1:45   Show results
1:45 - 1:55   Features summary
1:55 - 2:00   Closing
```

## Submission Checklist

- [ ] Video recorded (2-4 minutes)
- [ ] Text overlays added
- [ ] Video exported (1080p recommended)
- [ ] Uploaded to YouTube/Vimeo
- [ ] Link copied
- [ ] Ready to submit on Zama Guild

## Final Notes

**You don't need:**

- ❌ Your face on camera
- ❌ Your voice
- ❌ Professional video equipment
- ❌ Video editing experience

**You only need:**

- ✓ Screen recording
- ✓ Text overlays
- ✓ 30-60 minutes of time

**The video should show:**

1. Your project works
2. Key features in action
3. Professional presentation

Good luck with your submission! 🚀
