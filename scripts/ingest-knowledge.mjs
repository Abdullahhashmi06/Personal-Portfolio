#!/usr/bin/env node

/**
 * Knowledge Base Ingestion Script
 *
 * Reads portfolio data from the existing codebase and ingests it
 * into Supabase with embeddings for RAG retrieval.
 *
 * Usage:
 *   node scripts/ingest-knowledge.mjs
 *
 * Requires:
 *   - SUPABASE_URL
 *   - SUPABASE_SERVICE_ROLE_KEY
 *   - Node.js 18+ (for fetch)
 */

import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";
import { pipeline } from "@huggingface/transformers";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";

/* ── Configuration ────────────────────────────────────── */

const MODEL_ID = "Xenova/all-MiniLM-L6-v2";
const MAX_CHUNK_SIZE = 800;
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_KEY) {
  console.error("Error: Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  console.error("Example:");
  console.error("  SUPABASE_URL=https://xxx.supabase.co SUPABASE_SERVICE_ROLE_KEY=xxx node scripts/ingest-knowledge.mjs");
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ── Text Chunking ────────────────────────────────────── */

function chunkText(text, metadata = {}) {
  const chunks = [];
  const paragraphs = text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter((p) => p.length > 0);

  let current = "";
  let index = 0;

  for (const paragraph of paragraphs) {
    if (paragraph.length <= MAX_CHUNK_SIZE) {
      const combined = current ? current + "\n\n" + paragraph : paragraph;
      if (combined.length <= MAX_CHUNK_SIZE) {
        current = combined;
        continue;
      }
      if (current) {
        chunks.push({ content: current, index: index++, metadata });
      }
      current = paragraph;
    } else {
      if (current) {
        chunks.push({ content: current, index: index++, metadata });
        current = "";
      }
      // Split large paragraph by sentences
      const sentences = paragraph
        .split(/(?<=[.!?])\s+/)
        .filter((s) => s.length > 0);
      for (const sentence of sentences) {
        const combined = current ? current + " " + sentence : sentence;
        if (combined.length <= MAX_CHUNK_SIZE) {
          current = combined;
        } else {
          if (current) {
            chunks.push({ content: current, index: index++, metadata });
          }
          current = sentence;
        }
      }
    }
  }

  if (current) {
    chunks.push({ content: current, index, metadata });
  }

  return chunks;
}

/* ── Embedding Generation ─────────────────────────────── */

let extractor = null;

async function getExtractor() {
  if (!extractor) {
    console.log("Loading embedding model (this may take a moment on first run)...");
    extractor = await pipeline("feature-extraction", MODEL_ID, {
      device: "cpu",
    });
    console.log("Embedding model loaded.\n");
  }
  return extractor;
}

async function embed(text) {
  const pipe = await getExtractor();
  const output = await pipe(text, { pooling: "mean", normalize: true });
  return Array.from(output.data.slice(0, 384));
}

/* ── CV Loader ────────────────────────────────────────── */

function loadCV() {
  const possiblePaths = [
    join(process.cwd(), "data", "cv.txt"),
    join(process.cwd(), "data", "cv.pdf"),
  ];

  for (const p of possiblePaths) {
    if (existsSync(p)) {
      if (p.endsWith(".txt")) {
        console.log(`  Found CV at: ${p}`);
        return readFileSync(p, "utf-8");
      }
      if (p.endsWith(".pdf")) {
        console.log(`  ⚠ PDF CV found at ${p} but PDF parsing is not yet implemented.`);
        console.log(`    To use your CV, convert it to a .txt file and place it at data/cv.txt`);
        return null;
      }
    }
  }

  console.log("  ℹ No CV found at data/cv.txt or data/cv.pdf — skipping CV ingestion.");
  console.log("    To add your CV later, place it at data/cv.txt and re-run this script.");
  return null;
}

/* ── Portfolio Data Sources ────────────────────────────── */

function getPortfolioDocuments() {
  const documents = [];

  // ── CV / Resume (loaded from file if available) ──
  const cvContent = loadCV();
  if (cvContent) {
    documents.push({
      title: "Abdullah Hashmi — CV",
      source: "cv",
      content: cvContent,
      metadata: { section: "full-cv" },
    });
  }

  // ── About ──
  documents.push({
    title: "About Abdullah Hashmi",
    source: "portfolio",
    content: `
Abdullah Hashmi
BS Artificial Intelligence Student
FAST NUCES Islamabad

EDUCATION
Bachelor of Science in Artificial Intelligence
FAST National University of Computer and Emerging Sciences (NUCES), Islamabad
Currently in 3rd semester

FOCUS AREAS
- AI Applications
- Software Development
- Product Building
- Machine Learning

ABOUT
I'm a BS Artificial Intelligence student at FAST NUCES Islamabad, currently in my 3rd semester. I build software and AI projects alongside my studies — designing experiences, architecting systems, and shipping products.

Most of my time goes to coursework, side projects, and the occasional all-nighter debugging something I was confident about an hour earlier. That's university life, and I wouldn't trade it.

I care about the details most people never notice — the spacing, the motion, the edge cases — because those are the difference between software that works and software that feels right.
`,
    metadata: { section: "about" },
  });

  // ── InternIQ ──
  documents.push({
    title: "InternIQ — Project Information",
    source: "portfolio",
    content: `
InternIQ is an AI-powered recruitment platform designed to streamline internship hiring. It helps recruiters define screening requirements, analyze candidate CVs, map evidence to requirements, and review candidates through structured AI-assisted evaluation.

Status: Featured Project
Technologies: Next.js, TypeScript, Supabase, AI
Developers: Abdullah Hashmi, Umer Sheikh
GitHub: https://github.com/Abdullahhashmi06/bhartibot
Live: https://www.interniq.pk/
Case Study: /work/interniq

Key Features:
- Tailored Screening Criteria: Recruiters define required and preferred skills, academic qualifications, and custom screening questions for each role.
- Evidence Mapping: Candidate CV information is mapped against recruitment requirements to surface relevant experience and qualifications.
- AI Match Scoring: Candidates receive a structured AI-assisted match score based on how well their profile aligns with the role requirements.
- Candidate Insights: Recruiters can view strengths, weaknesses, missing skills, and supporting evidence for each candidate.
- Public Application Workflow: Applicants can apply through a shared public link without requiring an account.
- Recruitment Dashboard: Recruiters review candidates and make shortlisting decisions through a centralized, organized interface.

How It Works:
1. Define Requirements: Recruiters define the role, work mode, duration, technical requirements, academic qualifications, and screening criteria.
2. Collect & Analyze Applications: Applicants apply through a public link, upload their CV, and answer screening questions. InternIQ analyzes the submitted information.
3. Review AI Evidence: Recruiters receive structured evaluation including AI match score, requirement evidence, candidate strengths, missing skills, and ranking.

Impact: InternIQ is designed to reduce manual screening effort, make candidate comparison more structured, and surface relevant evidence faster — helping recruiters focus on the candidates that matter most.
`,
    metadata: { project: "InternIQ", section: "overview" },
  });

  documents.push({
    title: "InternIQ — Case Study Details",
    source: "case-study",
    content: `
InternIQ Case Study: AI-Powered Internship Recruitment Platform

The Problem: Recruitment is manual, slow, and inconsistent. Recruiters receive large volumes of CVs for internship positions. Manually reviewing each candidate is time-consuming, and relevant evidence can be buried inside resumes. Comparing candidates against role-specific requirements becomes inconsistent without structured evaluation.

The Solution: AI-assisted recruitment, not AI-controlled recruitment. InternIQ gives recruiters the tools to define roles, specify requirements, collect applications, and receive structured candidate evaluations — while keeping the human in control of the final decision.

InternIQ was built by Abdullah Hashmi and Umer Sheikh as a project to address real recruitment workflow challenges. The focus was on designing a practical product that assists recruiters through structured AI evaluation rather than replacing human judgment.
`,
    metadata: { project: "InternIQ", section: "case-study" },
  });

  // ── MLP Project ──
  documents.push({
    title: "MNIST Multilayer Perceptron — Project Information",
    source: "portfolio",
    content: `
MNIST Multilayer Perceptron (MLP)
Calculus-Driven Neural Network
Status: Case Study
Technologies: Python, Machine Learning, Multivariable Calculus
Developer: Abdullah Hashmi
Case Study: /work/mlp

Description: An MLP built from the mathematical foundations of Multivariable Calculus, using Google's MNIST dataset to explore gradient-based learning and neural-network classification.

The objective was to implement a multilayer perceptron capable of learning patterns from the MNIST dataset and classifying previously unseen handwritten digit images — while applying the mathematical concepts studied in Multivariable Calculus coursework.

Mathematical Foundation:
- Gradients & Partial Derivatives: The network computes how each weight affects the loss, using partial derivatives to determine the direction and magnitude of updates.
- Loss Functions: A loss function quantifies the difference between predicted and actual outputs, providing the signal for optimization.
- Gradient Descent: Parameters are updated iteratively by moving in the direction that reduces the loss, guided by computed gradients.
- Backpropagation: The chain rule enables efficient gradient computation through the network's layers, propagating error signals backward.

Training Process:
1. Forward Propagation: Input images pass through the network, producing predictions via weighted sums and activation functions.
2. Loss Computation: A loss function measures the difference between the network's predictions and the actual digit labels.
3. Gradient Calculation: Backpropagation computes gradients of the loss with respect to each weight using the chain rule.
4. Weight Updates: Gradient descent adjusts model parameters to reduce the loss, iteratively improving the network's accuracy.

Dataset: Google's MNIST Dataset — a standard benchmark of 70,000 handwritten digit images (28x28 pixels).

What This Demonstrates:
- Learning from Image Data
- Optimization Through Gradient Descent
- Applying Calculus to Machine Learning
- MLP Training Pipeline
- Mathematics to Neural Networks
`,
    metadata: { project: "MLP", section: "overview" },
  });

  // ── Image Filtering System ──
  documents.push({
    title: "OOP Image Filtering System — Project Information",
    source: "portfolio",
    content: `
OOP Image Filtering System
Object-Oriented Programming • FAST NUCES • Semester 2
Status: Academic Project
Technologies: C++, OOP, Image Processing
Developer: Abdullah Hashmi
Case Study: /work/image-filtering

Description: An interactive image-processing application built to apply Object-Oriented Programming concepts to real image manipulation workflows — from user authentication to filter pipelines.

The Challenge: Applying OOP to a practical application. The goal was to take concepts from Object-Oriented Programming and apply them to a practical software system rather than implementing isolated classroom examples.

The Solution: An interactive image-filtering workflow. The application provides a structured user experience: log in, select a preloaded image, preview it, build a filter pipeline, apply transformations, and save the processed result — all organized through object-oriented design.

Application Workflow:
1. Login: The user authenticates through the application's login system.
2. Select Image: The user chooses an image from the collection of preloaded images.
3. Preview Image: The selected image can be previewed before processing.
4. Build Filter Pipeline: The user constructs a sequence of image-processing operations.
5. Apply Pipeline & Save: The selected filters are applied in sequence and the processed image can be saved.
6. Logout: The user can safely exit the application.

Filtering Features: Grayscale, RGB/Color Filters, Brightness, Inversion

Where OOP Meets Image Processing:
- Encapsulation: Each component manages its own state and behavior.
- Abstraction: Complex operations are hidden behind clean interfaces.
- Modularity: Features are organized into separate, reusable components.
- Separation of Responsibilities: Authentication, image handling, and filtering are kept distinct.
- Reusable Operations: Filtering operations are designed as composable units.

What This Demonstrates: Applying OOP to Real Software, Modular Software Design, User Authentication, Image-Processing Workflows, Filter Composition.

GitHub: https://github.com/Abdullahhashmi06/image-filtering-system
`,
    metadata: { project: "Image Filtering", section: "overview" },
  });

  // ── Skills & Technologies ──
  documents.push({
    title: "Skills & Technologies",
    source: "portfolio",
    content: `
Primary Technologies: Python, C++, TypeScript, React, Next.js, Supabase, Machine Learning, AI, Git, GitHub, Node.js, PostgreSQL, Tailwind CSS, Docker

Secondary Technologies: System Design, APIs, LLMs, Computer Vision, Data Pipelines, Cloud, CI/CD, Testing, Rust, Linux

Capabilities:
- AI & Machine Learning: LLM applications, ML pipelines, Computer vision
- Software Development: TypeScript / React, APIs & backends, Databases
- Systems & Tooling: C++ / Rust, Git & CI/CD, Linux
`,
    metadata: { section: "skills" },
  });

  // ── Social Links ──
  documents.push({
    title: "Social Links & Contact",
    source: "portfolio",
    content: `
GitHub: https://github.com/Abdullahhashmi06 (handle: Abdullahhashmi06)
LinkedIn: https://www.linkedin.com/in/abdullah-hashmi-59ab951b3
Contact Page: /contact
Website: Abdullah Hashmi's portfolio website
`,
    metadata: { section: "social-links" },
  });

  return documents;
}

/* ── Upsert Document (idempotent) ─────────────────────── */

async function upsertDocument(doc) {
  // Check if document already exists
  const { data: existing } = await supabase
    .from("documents")
    .select("id")
    .eq("title", doc.title)
    .eq("source", doc.source)
    .single();

  let docId;

  if (existing) {
    // Update existing document
    const { data: updated, error } = await supabase
      .from("documents")
      .update({
        content: doc.content,
        metadata: doc.metadata,
      })
      .eq("id", existing.id)
      .select("id")
      .single();

    if (error) {
      console.error(`  ✗ Failed to update document: ${error.message}`);
      return null;
    }

    docId = updated.id;

    // Delete old chunks (will be re-created)
    const { error: deleteError } = await supabase
      .from("document_chunks")
      .delete()
      .eq("document_id", docId);

    if (deleteError) {
      console.error(`  ✗ Failed to delete old chunks: ${deleteError.message}`);
      return null;
    }

    console.log(`  Updated existing document (id: ${docId})`);
  } else {
    // Insert new document
    const { data: newDoc, error } = await supabase
      .from("documents")
      .insert({
        title: doc.title,
        source: doc.source,
        content: doc.content,
        metadata: doc.metadata,
      })
      .select("id")
      .single();

    if (error) {
      console.error(`  ✗ Failed to create document: ${error.message}`);
      return null;
    }

    docId = newDoc.id;
    console.log(`  Created new document (id: ${docId})`);
  }

  return docId;
}

/* ── Main Ingestion Process ───────────────────────────── */

async function ingest() {
  console.log("=== Portfolio Knowledge Base Ingestion ===\n");

  const documents = getPortfolioDocuments();
  console.log(`Found ${documents.length} documents to ingest.\n`);

  let totalChunks = 0;
  let errors = 0;

  for (const doc of documents) {
    console.log(`Processing: ${doc.title} (${doc.source})`);

    // 1. Upsert document
    const docId = await upsertDocument(doc);
    if (!docId) {
      errors++;
      console.log(`  ⚠ Skipping chunks for this document\n`);
      continue;
    }

    // 2. Chunk the text
    const chunks = chunkText(doc.content, doc.metadata);
    console.log(`  Created ${chunks.length} chunks`);

    // 3. Generate embeddings and insert chunks
    let chunksIngested = 0;
    for (const chunk of chunks) {
      try {
        const embedding = await embed(chunk.content);

        const { error } = await supabase.from("document_chunks").insert({
          document_id: docId,
          content: chunk.content,
          chunk_index: chunk.index,
          embedding,
          metadata: chunk.metadata,
        });

        if (error) {
          console.error(`  ✗ Failed to insert chunk ${chunk.index}: ${error.message}`);
          errors++;
          continue;
        }

        chunksIngested++;
        totalChunks++;
      } catch (err) {
        console.error(`  ✗ Embedding failed for chunk ${chunk.index}: ${err.message}`);
        errors++;
      }
    }

    console.log(`  Ingested ${chunksIngested}/${chunks.length} chunks with embeddings\n`);
  }

  console.log("=== Ingestion Complete ===");
  console.log(`Total documents: ${documents.length}`);
  console.log(`Total chunks: ${totalChunks}`);
  if (errors > 0) {
    console.log(`Errors: ${errors}`);
  }
}

// Run
ingest().catch((err) => {
  console.error("\nIngestion failed:", err.message || err);
  process.exit(1);
});
