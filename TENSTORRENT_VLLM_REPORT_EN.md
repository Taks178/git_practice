# Tenstorrent tt-metal vLLM Integration Investigation Report

**Investigation Date**: February 13, 2026  
**Target Repository**: https://github.com/tenstorrent/tt-metal  
**Investigation Purpose**: Verify whether vLLM can run on Tenstorrent products and whether it can be called from external services (such as Claude Code)

---

## Executive Summary

This investigation has reached the following conclusions:

✅ **Conclusion 1: vLLM can run on Tenstorrent products**  
Tenstorrent provides a dedicated vLLM fork and plugin, enabling high-throughput LLM inference on Tenstorrent hardware.

✅ **Conclusion 2: External access is possible**  
The vLLM server provides OpenAI-compatible REST API endpoints, allowing calls from any external client including Claude Code via standard HTTP requests.

---

## 1. Integration Architecture

### Stack Overview

```
┌─────────────────────────────────────┐
│  Client Applications                │
│  (Claude Code, Custom Apps, etc.)   │
└────────────┬────────────────────────┘
             │ HTTP (OpenAI-compatible API)
             ▼
┌─────────────────────────────────────┐
│  vLLM Server (Tenstorrent Fork)     │
│  - /v1/completions                  │
│  - /v1/chat/completions             │
│  - /v1/embeddings                   │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  TT-Transformers                    │
│  (Tenstorrent-optimized models)     │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  TT-Metal Runtime                   │
│  (Device drivers, Core runtime)     │
└─────────────────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│  Tenstorrent Hardware               │
│  (n150, n300, T3K, Galaxy, etc.)    │
└─────────────────────────────────────┘
```

---

## 2. Support Matrix

### 2.1 Supported Models

| Model Family | Examples | Notes |
|-------------|----------|-------|
| Llama | Llama 3.2 1B/3B, Llama 3.3 70B | Includes multimodal (Vision) support |
| Qwen | Qwen 1.5/2.5/3 series | Various size variants |
| Mistral | Mistral 7B, Mixtral 8x7B | MoE architecture supported |
| Gemma | Gemma 2B/7B | Google models |
| DeepSeek | DeepSeek series | Latest efficient models |

### 2.2 Supported Hardware

| Device | Applicable Model Size | Notes |
|--------|----------------------|-------|
| n150 | Small models (1B-3B) | Entry level |
| n300 | Medium models (7B-13B) | Standard inference |
| T3K | Large models (70B+) | Enterprise grade |
| Galaxy | Ultra-large models | Multi-card configuration |
| QuietBox / LoudBox | Integrated systems | All-in-one boxes |

---

## 3. API Integration

### 3.1 OpenAI-Compatible Endpoints

```
POST /v1/completions          # Text completion
POST /v1/chat/completions     # Chat-style interaction
POST /v1/embeddings           # Embedding vector generation
```

### 3.2 Example: Calling from External Services

#### Python Client Example

```python
import requests

VLLM_ENDPOINT = "http://your-tenstorrent-server:8000"

response = requests.post(
    f"{VLLM_ENDPOINT}/v1/chat/completions",
    json={
        "model": "meta-llama/Llama-3.2-1B-Instruct",
        "messages": [
            {"role": "user", "content": "Hello, how are you?"}
        ],
        "temperature": 0.7,
        "max_tokens": 100
    }
)

print(response.json()["choices"][0]["message"]["content"])
```

#### Using OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://your-tenstorrent-server:8000/v1",
    api_key="not-needed"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[
        {"role": "user", "content": "Explain quantum computing"}
    ]
)

print(response.choices[0].message.content)
```

---

## 4. Setup Instructions

### 4.1 From Source

```bash
# 1. Clone TT-Metal
git clone https://github.com/tenstorrent/tt-metal.git --recurse-submodules
cd tt-metal

# 2. Install dependencies
./install_dependencies.sh

# 3. Build and create virtual environment
./build_metal.sh && ./create_venv.sh
source python_env/bin/activate

# 4. Install vLLM plugin
git clone https://github.com/tenstorrent/tt-inference-server.git
cd tt-inference-server/tt-vllm-plugin
pip install -e .

# 5. Set environment variable
export VLLM_USE_V1=1
```

### 4.2 Using Docker

```bash
docker pull ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc

docker run -it --rm \
  -v /dev/hugepages-1G:/dev/hugepages-1G \
  --device /dev/tenstorrent \
  -p 8000:8000 \
  ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc bash
```

### 4.3 Start Server

```bash
python3 run.py \
  --model Llama-3.2-1B-Instruct \
  --device n300 \
  --workflow server \
  --docker-server
```

---

## 5. Key Features

### 5.1 Performance

- **Continuous Batching**: Dynamic batch scheduling preserved on TT backend
- **High Throughput**: Leverages Tenstorrent hardware acceleration
- **Memory Efficiency**: Custom KV cache management

### 5.2 Compatibility

- **OpenAI-Compatible API**: Maximum compatibility with existing workflows
- **Standard Toolchain**: Use existing development and monitoring tools
- **Multimodal Support**: Text and vision models

### 5.3 Development Tools

- **TT-SMI**: System management interface
- **TT-NN Visualizer**: Neural network visualization
- **Model Explorer**: Model structure analysis
- **Debug Tools**: Kernel-level debugging and profiling

---

## 6. Answers to Investigation Questions

### Q1: Can vLLM run on Tenstorrent products?

✅ **Answer**: Yes, it can.

- Official vLLM fork and plugin provided by Tenstorrent
- Supports major LLM models (Llama, Mistral, Qwen, etc.)
- Compatible with wide range of hardware (n150 to Galaxy)
- Simplified setup with Docker images and automation scripts

### Q2: Can it be called from external sources (Claude Code)?

✅ **Answer**: Yes, it can.

- Provides OpenAI-compatible REST API endpoints
- Can be called via standard HTTP clients (Python requests, curl, OpenAI SDK, etc.)
- Supports authentication and custom headers
- Easy integration into microservice architectures and agent workflows

---

## 7. Integration Scenarios with Claude Code

1. **Direct API Calls**: Call vLLM-TT-Metal server from Claude Code extensions/plugins via HTTP
2. **Microservice Architecture**: Use Claude Code as frontend, Tenstorrent vLLM as backend LLM inference engine
3. **Agent Workflows**: Combine multiple LLM agents, executing specific tasks on Tenstorrent hardware

---

## 8. References

- **TT-Metal GitHub Repository**: https://github.com/tenstorrent/tt-metal
- **vLLM Integration Fork**: https://github.com/tenstorrent/vllm
- **tt-inference-server**: https://github.com/tenstorrent/tt-inference-server
- **Official Documentation**: https://docs.tenstorrent.com/
- **Developer Portal**: https://tenstorrent.com/en/developers/

---

## 9. Recommended Next Steps

1. **Build PoC Environment**: Set up test environment with minimal configuration (n150 + small model)
2. **Run Benchmarks**: Measure throughput and latency with actual workloads
3. **Integration Testing**: Test integration with external systems like Claude Code
4. **Production Design**: Design production environment including redundancy, scalability, and monitoring

---

**Investigator**: GitHub Copilot  
**Last Updated**: February 13, 2026
