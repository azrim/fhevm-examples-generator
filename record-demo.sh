#!/bin/bash

# FHEVM Examples Generator - Demo Recording Script
# This script provides commands to record a demo video

echo "=== FHEVM Examples Generator Demo Recording ==="
echo ""
echo "Choose your recording method:"
echo "1. asciinema (terminal recording)"
echo "2. ffmpeg (screen capture)"
echo "3. Manual commands (copy-paste)"
echo ""

# Method 1: asciinema (recommended for terminal demos)
echo "METHOD 1: asciinema"
echo "Install: npm install -g asciinema"
echo "Record: asciinema rec demo.cast"
echo "Play: asciinema play demo.cast"
echo "Upload: asciinema upload demo.cast"
echo ""

# Method 2: ffmpeg (for screen capture)
echo "METHOD 2: ffmpeg"
echo "Install: https://ffmpeg.org/download.html"
echo "Record (Linux): ffmpeg -video_size 1920x1080 -framerate 25 -f x11grab -i :0.0 demo.mp4"
echo "Record (macOS): ffmpeg -f avfoundation -i '1:0' -r 30 demo.mp4"
echo "Record (Windows): ffmpeg -f gdigrab -framerate 30 -i desktop demo.mp4"
echo ""

# Method 3: Manual commands to run
echo "METHOD 3: Manual Commands"
echo "Run these commands in sequence while recording:"
echo ""

cat << 'EOF'
# 1. Introduction
echo "FHEVM Examples Generator Demo"

# 2. Setup
node --version
npm --version
git --version
npm ci

# 3. Scaffold single example
npm run cli basic-counter -- \
  --contractTemplate templates/contracts/basic-counter.sol \
  --testTemplate templates/tests/basic-counter.test.ts

# 4. Inspect generated example
cd scaffolded/basic-counter
git log --oneline --decorate -n 10
head -n 30 README.md

# 5. Run tests
npm ci
npm test || npx hardhat compile

# 6. Scaffold all examples
cd ../..
npm run scaffold:all

# 7. Review deliverables
cat summary.txt
cat deliverables.json

# 8. Show push instructions
echo "To push to GitHub:"
echo "cd scaffolded/basic-counter"
echo "git remote set-url your-origin git@github.com:YOUR-USERNAME/basic-counter.git"
echo "git push your-origin fhevm-example/basic-counter"

# 9. List scaffolded examples
ls -la scaffolded/

# 10. Conclusion
echo "Demo complete! Check README.md for full documentation."
EOF

echo ""
echo "=== Recording Tips ==="
echo "- Clear terminal before starting: clear"
echo "- Use a readable terminal font size (14-16pt)"
echo "- Set terminal to 80x24 or larger"
echo "- Speak clearly and explain each step"
echo "- Pause briefly between commands"
echo "- Show output clearly before moving on"
echo "- Keep total time under 4 minutes"
echo ""
echo "=== Post-Recording ==="
echo "- Review the recording"
echo "- Trim any mistakes"
echo "- Add captions if needed"
echo "- Upload to YouTube or similar platform"
echo "- Include link in bounty submission"
echo ""
