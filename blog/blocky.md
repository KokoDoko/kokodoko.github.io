# Using AI to generate Game Avatars

In this post I want to share a few recent research results, where I try to generate live 3D shapes with AI. By "live" I mean that the 3D shapes are not pre-generated, but will be created based on the users preferences while the app or game is running.

<br><Br><br>

## Do language models dream of blocky monsters?

In this first experiment I wanted to find out if a language model *(chatGPT 4o and chatGPT3.5)* has a visual imagination. My prompts to the model are like this:

```
What would a cat look like if it was made out of 40 blocks? Tell me the size and location of those blocks in 3D space
```
Then, the results of the prompt are given to a traditional 3D engine, like Unity or in this case [ThreeJS](https://threejs.org). Some results:

| Blocky Avatars |  |  |
|--------------------|--------------------|------|
![](./images/avatar1.png)  | ![](./images/avatar2.png) | ![](./images/avatar3.png) |
![](./images/avatar4.png)  | ![](./images/avatar5.png) | ![](./images/avatar6.jpg) |


<span style="font-size:1.2em;">[➡️ Create your own blocky monsters here](https://blocky-avatars.vercel.app/)</span>

<br><Br><br>

## Using an actual 3D model generator

Although using a LLM to create visuals is really fun, the results are highly erratic. The model seems unable to create more complex block configurations. 

The next step is to try out [StabilityAI](https://platform.stability.ai), this is a service that is good at generating 2D images *and* 3D models really fast.

The downside of the 3D model generator is that it needs an image to base the 3D model on. I decided to generate images based on a prompt sent to a language model. So the whole process takes 3 steps: 

<br>


### Step 1

Prompting ChatGPT:

```
Give me three ideas for cool game avatars, keep the ideas short and sweet. Here are some examples: a cute cat wearing a baseball cap, a skeleton wearing sunglasses, a scruffy dog wearing a bandshirt
```
The ideas are shown as buttons.

### Step 2

Prompting StabilityAI for an image is done with the text from the button that the user clicked:

```
Create a simple image for a cheerful robot with headphones. Keep the image simple, without any background and not too much detail. It can look like a toy.
```

### Step 3

Here we send the image that was just generated *(and is stored on the server)* straight back to StabilityAI, to create a 3D model. This whole model gets sent back to the user as a `glb` file. In this demo I display the `glb` directly using [modelviewer](https://modelviewer.dev). 



<br><Br><br>


## Result

![robot](./images/avatar-generator-robot.png)


<br><Br><br>
