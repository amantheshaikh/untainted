#!/bin/bash

# bundle_context.sh
# Generates a single text file containing key project context for AI agents.

OUTPUT_FILE="untainted_ai_context.txt"

echo "# Untainted Project Context Bundle" > "$OUTPUT_FILE"
echo "Generated on $(date)" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "## 1. Project Context Summary" >> "$OUTPUT_FILE"
cat .agent/project_context.md >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "## 2. System Hologram (Feature Map)" >> "$OUTPUT_FILE"
cat docs/SYSTEM_MAP.md >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "## 3. Database Schema" >> "$OUTPUT_FILE"
cat docs/DATABASE_SCHEMA.md >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "## 4. Directory Structure" >> "$OUTPUT_FILE"
# Listing structure excluding ignored files
find . -maxdepth 3 -not -path '*/.*' -not -path '*/node_modules*' -not -path '*/__pycache__*' >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "----------------------------------------" >> "$OUTPUT_FILE"
echo "## 5. Database Schema (Additives Definitions)" >> "$OUTPUT_FILE"
# Assuming text files are the source of truth for now based on exploration
head -n 20 backend/additives.txt >> "$OUTPUT_FILE" 
echo "... (truncated)" >> "$OUTPUT_FILE"

echo "" >> "$OUTPUT_FILE"
echo "Done! Context bundled into $OUTPUT_FILE"
