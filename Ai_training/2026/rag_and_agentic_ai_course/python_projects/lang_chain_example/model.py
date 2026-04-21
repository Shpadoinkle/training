from langchain_ibm import ChatWatsonx
from langchain.prompts import PromptTemplate
from config import PARAMETERS, LLAMA_MODEL_ID, GRANITE_MODEL_ID, MISTRAL_MODEL_ID


"""
Let's break down the imports

ChatWatsonx will be our interface to interact with IBM Watsonx AI models.
PromptTemplate allows us to create dynamic prompts with placeholders for AI input.
PARAMETERS, LLAMA_MODEL_ID, etc. are the configuration values we defined earlier to set up our different AI models.

"""

# Function to initialize a model
def initialize_model(model_id):
    return ChatWatsonx(
        model_id=model_id,
        url="https://us-south.ml.cloud.ibm.com",
        project_id="skills-network",
        params=PARAMETERS
    )

# Initialize models
llama_llm = initialize_model(LLAMA_MODEL_ID)
granite_llm = initialize_model(GRANITE_MODEL_ID)
mistral_llm = initialize_model(MISTRAL_MODEL_ID)

"""
We will once again initialize our models, this time we're going to take advantage of LangChain's ChatWatsonx, a wrapper for WatsonX API client.
"""

# Prompt template
llama_template = PromptTemplate(
    template='''<|begin_of_text|><|start_header_id|>system<|end_header_id|>
{system_prompt}<|eot_id|><|start_header_id|>user<|end_header_id|>
{user_prompt}<|eot_id|><|start_header_id|>assistant<|end_header_id|>
''',
    input_variables=["system_prompt", "user_prompt"]
)

granite_template = PromptTemplate(
    template="<|system|>{system_prompt}\n\<|user|>{user_prompt}\n<|assistant|>",
    input_variables=["system_prompt", "user_prompt"]
)

mistral_template = PromptTemplate(
    template="<s>[INST]{system_prompt}\n{user_prompt}[/INST]",
    input_variables=["system_prompt", "user_prompt"]
)

"""
To make our prompts more reusable and adaptable across our chats, we can use the PromptTemplate class. This allows us to define templates with placeholders that can be filled dynamically at runtime with specific inputs.

By defining placeholders like system_prompt, and user_prompt, these templates can be reused with different content, making them flexible for various interactions with AI models.
"""

def get_ai_response(model, template, system_prompt, user_prompt):
    chain = template | model
    return chain.invoke({'system_prompt':system_prompt, 'user_prompt':user_prompt})

"""
The functionget_ai_responseallows us to chain a prompt template and an AI model together. We can using the pipe operator|to directly take the output of the template and use that as the input of the model.
"""
# Model-specific response functions
def llama_response(system_prompt, user_prompt):
    return get_ai_response(llama_llm, llama_template, system_prompt, user_prompt)

def granite_response(system_prompt, user_prompt):
    return get_ai_response(granite_llm, granite_template, system_prompt, user_prompt)

def mistral_response(system_prompt, user_prompt):
    return get_ai_response(mistral_llm, mistral_template, system_prompt, user_prompt)

"""
The model-specific functions each call this generic function with the respective models and templates, ensuring that the appropriate format is used for each AI model when generating responses.

Let's break down this code:

We import necessary modules and our configuration.
We define a function initialize_model to create model instances, promoting code reuse.
We initialize our models using this function.
We create prompt templates for each model, as they may have different preferred formats.
The get_ai_response function handles the process of formatting prompts, getting responses
We define model-specific response functions that use the general get_ai_response function.
This modular approach allows for easy addition of new models or modification of existing ones.
"""