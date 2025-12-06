# Next Steps - Adding Demo Video

Follow these steps to make your demo video playable directly in README.md.
## Step 1: Upload Video to GitHub (For Inline Playback)

GitHub allows you to upload videos directly to issues/PRs, which generates a permanent URL that works in README.

### Method A: Via GitHub Issue (Easiest)

1. Go to your repository: https://github.com/azrim/fhevm-examples-generator
2. Click "Issues" → "New issue"
3. Title: "Demo Video Upload" (temporary, we'll close it)
4. In the comment box, **drag and drop** `D:\Project\zama\demo.mp4`
5. Wait for upload to complete (you'll see a URL like: `https://github.com/azrim/fhevm-examples-generator/assets/123456/abc-def-ghi.mp4`)
6. **Copy that URL** (right-click the video → Copy video address)
7. Close the issue without submitting (or submit and close it)

### Method B: Via Git LFS (If video < 100MB)

If your video is under 100MB, you can commit it directly:

```bash
# Copy video to repo root
copy D:\Project\zama\demo.mp4 .

# Add and commit
git add demo.mp4
git commit -m "feat: add demo video"
git push
```

Then the URL will be: `https://github.com/azrim/fhevm-examples-generator/raw/master/demo.mp4`

## Step 2: Update README.md

Replace the placeholder in README.md with your video URL:

```bash
# Find this line in README.md:
https://github.com/azrim/fhevm-examples-generator/assets/YOUR_USER_ID/YOUR_VIDEO_ID.mp4

# Replace with your actual URL from Step 1, for example:
https://github.com/azrim/fhevm-examples-generator/assets/123456/abc-def-ghi.mp4
```

**Important:** Use the direct `.mp4` URL, not a GitHub page URL. The format should be:
- ✅ `https://github.com/USER/REPO/assets/ID/VIDEO.mp4`
- ✅ `https://github.com/USER/REPO/raw/master/demo.mp4`
- ❌ `https://github.com/USER/REPO/blob/master/demo.mp4` (won't play inline)

## Step 3: Test the Video

1. Save README.md
2. Commit and push:
   ```bash
   git add README.md
   git commit -m "docs: add inline demo video"
   git push
   ```
3. Visit your GitHub repo and check if video plays inline in README

## Alternative: Use HTML Video Tag

If the simple URL doesn't work, use HTML:

```html
<video src="https://github.com/azrim/fhevm-examples-generator/assets/YOUR_ID/YOUR_VIDEO.mp4" controls width="100%">
  Your browser does not support the video tag.
</video>
```

Replace in README.md:
```markdown
## 🎥 Demo Video

<video src="YOUR_VIDEO_URL_HERE" controls width="100%">
  Your browser does not support the video tag.
</video>
```

## Step 4: Update SUBMISSION_NOTE.md

Replace `[INSERT YOUR VIDEO URL HERE]` in SUBMISSION_NOTE.md with your video URL.

## Step 5: Commit and Push

```bash
git add README.md SUBMISSION_NOTE.md
git commit -m "docs: add inline playable demo video"
git push
```

## Step 6: Contact Bounty Organizers

Since you can't resubmit the form, proactively contact the organizers:

### Via Discord (Recommended)

1. Join Zama Discord: https://discord.gg/zama
2. Find the bounty channel or DM a moderator
3. Send this message:

```
Hi! I submitted my FHEVM Examples Generator project for the December bounty (GitHub: azrim/fhevm-examples-generator).

I created a demo video as required, but accidentally forgot to include the link in the submission form. The form doesn't allow resubmission.

The demo video is now playable directly in the README (top of the page):
https://github.com/azrim/fhevm-examples-generator

I've also added a SUBMISSION_NOTE.md explaining the situation.

The project was submitted on time (Dec 6) and meets all requirements. I apologize for the oversight and hope this can be considered.

Thank you!
```

## What Reviewers Will See

When reviewers visit your repository, they'll immediately see:

1. **Playable demo video** at the very top of README
2. **Note** explaining the submission form oversight
3. **Complete project** with all deliverables
4. **Professional documentation**

## Quick Summary

1. Upload video via GitHub issue (drag & drop)
2. Copy the generated URL
3. Replace placeholder in README.md
4. Commit and push
5. Contact organizers on Discord

Good luck! 🚀
