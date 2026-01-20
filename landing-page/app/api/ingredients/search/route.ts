import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define the shape of our ingredient data
type Ingredient = {
    id: string;
    name: string;
    type: 'ingredient' | 'additive';
};

// Cache the data in memory to avoid reading files on every request
// In a serverless environment, this cache might reset, but it helps for warm instances
let cachedIngredients: Ingredient[] | null = null;

const PROJECT_ROOT = path.join(process.cwd(), '..'); // Assuming we are in landing-page dir

async function getIngredients(): Promise<Ingredient[]> {
    if (cachedIngredients) {
        return cachedIngredients;
    }

    const ingredients: Ingredient[] = [];

    try {
        // Read Ingredients File
        const ingredientsPath = path.join(PROJECT_ROOT, 'backend', 'ingredients.txt');
        if (fs.existsSync(ingredientsPath)) {
            const content = fs.readFileSync(ingredientsPath, 'utf-8');
            const lines = content.split('\n');
            let currentId = '';

            // Simple parsing strategy: look for "en:" lines that denote names
             // The file format is complex, but we can look for specific patterns
             // often lines start with "en: NAME" or "synonyms:en: NAME"
             // Based on the file view, standard entries look like:
             // en: SOYBEAN OIL
             // but there are also properties like "vegan:en: yes" which we want to ignore for now if we just want names.
             // Actually, looking at the file snippet:
             // 176: en: imazalil
             // 177: xx: imazalil

            for (const line of lines) {
                // Focus on primary English names for now
                if (line.startsWith('en:') && !line.includes(':en:')) {
                     const name = line.substring(3).trim();
                     // Filter out property lines that might accidentally match if format varies
                     if (name && !name.includes(':')) {
                         ingredients.push({
                             id: name.toLowerCase().replace(/\s+/g, '-'),
                             name: name,
                             type: 'ingredient'
                         });
                     }
                }
            }
        }

        // Read Additives File
        const additivesPath = path.join(PROJECT_ROOT, 'backend', 'additives.txt');
        if (fs.existsSync(additivesPath)) {
             const content = fs.readFileSync(additivesPath, 'utf-8');
             const lines = content.split('\n');
             
             // Additives file format is similar but often has E-numbers
             // 57: en: E100, Curcumin, Turmeric extract...
             for (const line of lines) {
                 if (line.startsWith('en:')) {
                     const name = line.substring(3).trim();
                      if (name && !name.includes(':')) {
                        // Split by comma if multiple names exist? The file often has "E100, Curcumin..."
                        // We can store the whole string or just the first part. 
                        // Let's store the whole string for context, or maybe split on comma.
                        // For search purposes, the whole line usually helps.
                         ingredients.push({
                             id: name.split(',')[0].trim().toLowerCase().replace(/\s+/g, '-'),
                             name: name,
                             type: 'additive'
                         });
                     }
                 }
             }
        }

    } catch (error) {
        console.error("Error reading ingredient files:", error);
    }

    cachedIngredients = ingredients;
    return ingredients;
}

export async function GET(request: NextRequest) {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q')?.toLowerCase();

    if (!query || query.length < 2) {
        return NextResponse.json({ results: [] });
    }

    const allIngredients = await getIngredients();
    
    // Perform filtering
    const results = allIngredients.filter(item => 
        item.name.toLowerCase().includes(query)
    ).slice(0, 50); // Limit to 50 results

    return NextResponse.json({ results });
}
