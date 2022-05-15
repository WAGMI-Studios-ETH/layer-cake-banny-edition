## Some general tips for art creation for NFT layering

### Basics

Create solid background images and mostly-transparent layer graphics to composite into a final image. Group the layer graphics by their function, e.g. Hats. The system will combine a random background with random traits from each given category, to produce a final layered image. E.g., in Meows(DAO)/naked/Traits, you will note a Background layer along with several foreground layers which are combined to generate a complete NFT image.

### Layer ordering

The order of the layers for each sub population needs to be communicated to the development team in order to allow them to composite layered images in the correct order. E.g., what goes on top, Glasses or Headwear?

### Rarity Naming

Any image file named similar to Subject_r10.png will be interpreted as a rare trait, only allowed in 10% of the population. A preceding zero as in Subject_r01.png will be interpreted as an implied decimal point, so in this case the asset will be used at most 0.01%. Note that due to a logic hole, there is no way to express 0.1% - 0.9% at this time. E.g., in the Meows(DAO) project, the file naked/Traits/Eyes/Bitcoin_r5.png may only be used by the compositing system in at most 5% of the individuals generated in the 'naked' population.

### (Background) Image Sizes

The background image must be big enough to fit all following images that may be layered on top. If there is an accessory file that is bigger than the background image being composited upon, the process will fail until something is resized manually. Keeping all image files the same size prevents this difficulty and prevents your assets from being resized (potentially reducing image quality slightly) during processing. E.g., in the Meows(DAO) project, if the backgrounds are 2084px x 2084px as most are, then another trait must not have resolution 2084px x 2085px, or the process will fail, and likely a developer resource will be forced to manually resize the larger image down to fit within the bounds of the background image. This is a technical limitation of the underpinnings of the compositing system.

### Multiple Populations

It is possible to define multiple sub populations within your art set, each in separate folders and with distinct sets of traits to draw from. Each population will only draw background and traits from within that population, there is no mixing of traits between populations. Note the multitude of directories under the Meows(DAO) project folder: each subfolder represents a sub population that is insular in nature but the results of which are combined to form the full meta-population (the final set of individuals generated from all sub populations).

### Single-member populations

To create a very specific member of the overall set of NFTs, with known trait characteristics and without randomization, simply create a population with one single possible combination of traits. For example, the Meows(DAO) sub-population 'diamond-hands' contains Traits with each layer containing only a single file, such that the result will be a known-in-advance member of the meta population with potentially unique and rare traits. This is in order to create a special one-off, non-randomized member. See the Meows(DAO)/diamond-hands sub population for an example. There is only one trait defined for each trait-type, and the system will be configured to only emit one single individual from this set.

### Project Folder

Name this something distinct to represent your overall project. This will be placed in the layered-assets folder for uptake. E.g. Animals. For another concrete example, note the Meows(DAO) project under layered-assets.

### Population Folder

Within the project folder, name place your population folders, named e.g. Animals/Birds and Animals/Fish. The populations for Meows(DAO) include: diamond-hands, henley, naked, pentaptych-alps, pendaptych-space, pentaptych-underwater, shirt, and t-shirt.

### Traits Folder

Inside each population folder, place a single folder named Traits, which will contain all trait folders. This is largely historical to development and doesn't do too much, but is required by the current system and is not a huge departure from efficiency.

### Traits Folders

Inside Traits, place all traits folders, e.g. Background, Body, Fur/Scales. In here you will place all graphics to represent the layer to the application. E.g., note the Meows(DAO)/henley/Traits sub-folders. Trait layers are defined for 11 traits: Background, Brows, Collar, Ears, Eyes, Fur, Glasses, Headwear, Henley, Nose, and Signature. These folders contain alternative graphical representations of each trait type, e.g. Collar contains collar images to be composited in a specific vertical layer within the final composited image.

### Example Folders

You might end up with paths such as Animals/Birds/Traits/Body and Animals/Birds/Traits/Feathers. In Meows(DAO) we find such folders as Meows(DAO)/henley/Traits/Glasses and Meows(DAO)/t-shirt/Traits/Fur.
