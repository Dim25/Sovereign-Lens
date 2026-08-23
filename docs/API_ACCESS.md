# Model API access

Sovereign Lens keeps credentials in a local `.env` file and provider/model
defaults in `config/providers.json`. The browser app must never receive these
keys; provider calls belong in a server-side runner or API.

## Setup

```bash
cp .env.example .env
# Add credentials to .env, then check the MVP panel:
python3 scripts/check_api_config.py
# Require the expanded eight-provider panel:
python3 scripts/check_api_config.py --all
```

The checker only reports whether variables are set. It never prints their values
and does not spend credits or contact providers.

## Where to obtain each credential

| Provider | Environment variable | Get the credential | Default model |
|---|---|---|---|
| OpenAI | `OPENAI_API_KEY` | [OpenAI project API keys](https://platform.openai.com/api-keys) | `gpt-5.6-sol` |
| Alibaba Model Studio / Qwen | `DASHSCOPE_API_KEY` | [Create a Model Studio API key](https://help.aliyun.com/en/model-studio/get-api-key) | `qwen3.8-max` |
| Mistral | `MISTRAL_API_KEY` | [Mistral API keys](https://console.mistral.ai/api-keys/) | `mistral-large-2512` |
| Anthropic | `ANTHROPIC_API_KEY` | [Anthropic Console API keys](https://console.anthropic.com/settings/keys) | `claude-opus-4-1` pending verification of the proposed `claude-fable-5` ID |
| xAI | `XAI_API_KEY` | [xAI Console](https://console.x.ai/) | `grok-4.6` |
| Google Gemini | `GEMINI_API_KEY` | [Google AI Studio API keys](https://aistudio.google.com/app/apikey) | `gemini-3.1-pro-preview` |
| DeepSeek | `DEEPSEEK_API_KEY` | [DeepSeek API keys](https://platform.deepseek.com/api_keys) | `deepseek-v4-pro` |
| Z.AI | `ZAI_API_KEY` | [Z.AI API keys](https://z.ai/manage-apikey/apikey-list) | `glm-5` pending verification of the proposed `glm-5.3` ID |

Creating an account/key does not necessarily grant a model: enable billing,
accept provider terms, and check account/region availability. Qwen's international
endpoint is the default; set `DASHSCOPE_BASE_URL` only when intentionally using a
different deployment region. Google is moving new projects to authorization keys;
use the key AI Studio creates rather than an unrestricted legacy key.

## Optional regional and self-hosted probes

- Hugging Face (`HF_TOKEN`) can cover gated/open-weight downloads and hosted
  inference for models such as Aya, Falcon, or Jais, subject to each model's terms.
- GigaChat uses `GIGACHAT_CREDENTIALS`; registration and availability can be
  region-dependent. Keep it outside the required MVP path.
- A local vLLM/Ollama-compatible deployment can use `SELF_HOSTED_BASE_URL`,
  `SELF_HOSTED_API_KEY`, and `SELF_HOSTED_MODEL`. The API key may be a local dummy
  value, depending on the server, but should still be treated as a secret.

## Reproducibility rule

Before an evaluation run, list the models available to the actual account and
store the returned model/version metadata. Do not silently replace a missing model
with another one. Record provider, host, region, exact requested model ID, returned
model ID or snapshot, request time, and whether the endpoint was preview or stable.
