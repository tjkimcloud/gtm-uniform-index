# Responsible-use boundary

This is a lighthearted analysis with a narrow input boundary.

## The system may describe

- visible garments
- readable clothing brands
- dominant clothing color
- visible formality of clothing
- whether the image contains enough visible clothing to classify
- simple background categories

## The system must not infer

- gender or gender identity
- race, ethnicity, religion, age, health, disability, or wealth
- personality
- professionalism
- leadership ability
- job performance
- business performance
- actual company culture
- intent behind clothing choices

## Source policy

The private pilot used current LinkedIn profile photos as a controlled point-in-time source. This public repository does not redistribute those photos, person-level results, or raw profile URLs.

Anyone reproducing the workflow is responsible for obtaining and using images lawfully and in accordance with the source platform's terms. Prefer images you own, are authorized to process, or have permission to use.

## Interpretation

Scores are deterministic transformations of model-observed clothing fields. Their numerical precision should not be mistaken for scientific measurement. They are designed for consistent comparison inside this project taxonomy.

## Retention

Do not commit source photos, API credentials, or private person-level exports. Delete local images when they are no longer needed for authorized analysis.

