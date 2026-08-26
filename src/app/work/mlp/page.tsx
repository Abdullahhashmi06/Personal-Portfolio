"use client";

import { CaseStudyHero } from "@/components/casestudy/CaseStudyHero";
import { CaseStudySection } from "@/components/casestudy/CaseStudySection";
import { WorkflowStep } from "@/components/casestudy/WorkflowStep";
import { Reveal } from "@/components/ui/Reveal";

export default function MLPCaseStudy() {
  return (
    <main className="min-h-screen">
      <CaseStudyHero
        title="MNIST Multilayer Perceptron"
        subtitle="Calculus-Driven Neural Network"
        description="An MLP built from the mathematical foundations of Multivariable Calculus, using Google's MNIST dataset to explore gradient-based learning and neural-network classification."
        image="/projects/MLP-light.png"
        imageAlt="MNIST Multilayer Perceptron visualization"
        technologies={["Python", "Machine Learning", "Multivariable Calculus"]}
        developers={["Abdullah Hashmi"]}
        links={{}}
      />

      {/* Problem */}
      <CaseStudySection label="The Goal">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Build a neural network that learns from handwritten digits.
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The objective was to implement a multilayer perceptron capable of
            learning patterns from the MNIST dataset and classifying previously
            unseen handwritten digit images — while applying the mathematical
            concepts studied in Multivariable Calculus coursework.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Mathematical Foundation */}
      <CaseStudySection label="Mathematical Foundation">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Calculus → Optimization → Learning
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The project connects mathematical concepts directly to neural
            network training. Partial derivatives and gradients form the basis
            for how the network learns — adjusting weights to minimize prediction
            error through gradient descent.
          </p>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {[
              {
                title: "Gradients & Partial Derivatives",
                description:
                  "The network computes how each weight affects the loss, using partial derivatives to determine the direction and magnitude of updates.",
              },
              {
                title: "Loss Functions",
                description:
                  "A loss function quantifies the difference between predicted and actual outputs, providing the signal for optimization.",
              },
              {
                title: "Gradient Descent",
                description:
                  "Parameters are updated iteratively by moving in the direction that reduces the loss, guided by computed gradients.",
              },
              {
                title: "Backpropagation",
                description:
                  "The chain rule enables efficient gradient computation through the network's layers, propagating error signals backward.",
              },
            ].map((concept, i) => (
              <Reveal key={concept.title} delay={i * 0.1}>
                <div className="rounded-2xl border border-line bg-white/[0.02] p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-fg">
                    {concept.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {concept.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </CaseStudySection>

      {/* Neural Network */}
      <CaseStudySection label="Neural Network Architecture">
        <Reveal>
          <p className="max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The network follows a standard MLP architecture with an input layer
            that receives flattened pixel data, hidden layer(s) that learn
            intermediate representations, and an output layer that produces
            class predictions for each digit (0–9).
          </p>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            Each layer transforms input features through learned weights and
            biases, with activation functions introducing the non-linearity
            needed to learn complex patterns in the data.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Training Process */}
      <CaseStudySection label="Training Process">
        <div className="max-w-2xl">
          <WorkflowStep
            number="01"
            title="Forward Propagation"
            description="Input images pass through the network, producing predictions via weighted sums and activation functions."
            index={0}
          />
          <WorkflowStep
            number="02"
            title="Loss Computation"
            description="A loss function measures the difference between the network's predictions and the actual digit labels."
            index={1}
          />
          <WorkflowStep
            number="03"
            title="Gradient Calculation"
            description="Backpropagation computes gradients of the loss with respect to each weight using the chain rule."
            index={2}
          />
          <WorkflowStep
            number="04"
            title="Weight Updates"
            description="Gradient descent adjusts model parameters to reduce the loss, iteratively improving the network's accuracy."
            index={3}
          />
        </div>
      </CaseStudySection>

      {/* Dataset */}
      <CaseStudySection label="Dataset">
        <Reveal>
          <h2 className="text-2xl font-semibold tracking-tight text-fg sm:text-3xl">
            Google&apos;s MNIST Dataset
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-muted sm:text-lg">
            The project uses the MNIST dataset — a standard benchmark of
            70,000 handwritten digit images (28×28 pixels). The model processes
            these images, learns to recognize digit patterns, and classifies
            previously unseen inputs into the corresponding digit class.
          </p>
        </Reveal>
      </CaseStudySection>

      {/* Results */}
      <CaseStudySection label="What This Demonstrates">
        <Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                title: "Learning from Image Data",
                description:
                  "The network learns to extract meaningful features from raw pixel values.",
              },
              {
                title: "Optimization Through Gradient Descent",
                description:
                  "Iterative parameter updates guided by computed gradients improve predictions over time.",
              },
              {
                title: "Applying Calculus to Machine Learning",
                description:
                  "Mathematical concepts from MVC directly power the training process.",
              },
              {
                title: "MLP Training Pipeline",
                description:
                  "End-to-end implementation from data loading through training and evaluation.",
              },
              {
                title: "Mathematics → Neural Networks",
                description:
                  "The connection between optimization theory and practical learning systems.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.08}>
                <div className="rounded-2xl border border-line bg-white/[0.02] p-6">
                  <h3 className="text-lg font-semibold tracking-tight text-fg">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </Reveal>
      </CaseStudySection>

      {/* Technology */}
      <CaseStudySection label="Technologies">
        <Reveal>
          <div className="flex flex-wrap gap-3">
            {["Python", "Machine Learning", "Multivariable Calculus"].map(
              (tech) => (
                <span
                  key={tech}
                  className="rounded-full border border-line bg-white/[0.02] px-4 py-2 font-mono text-sm text-muted"
                >
                  {tech}
                </span>
              )
            )}
          </div>
        </Reveal>
      </CaseStudySection>

      {/* Note about GitHub */}
      <CaseStudySection>
        <Reveal>
          <p className="max-w-2xl text-sm text-faint">
            This project has not been published to GitHub yet. The source code
            will be available in the future.
          </p>
        </Reveal>
      </CaseStudySection>
    </main>
  );
}
