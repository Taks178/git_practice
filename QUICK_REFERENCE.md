# Quick Reference: Tenstorrent vLLM Integration

## TL;DR

**Can vLLM run on Tenstorrent?** ✅ YES  
**Can it be called from external services?** ✅ YES (OpenAI-compatible API)

---

## Quick Start

### Option 1: Docker (Fastest)

```bash
docker pull ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc
docker run -it --rm -p 8000:8000 --device /dev/tenstorrent ghcr.io/tenstorrent/tt-metal/tt-metalium-ubuntu-20.04-amd64-release:latest-rc
```

### Option 2: From Source

```bash
git clone https://github.com/tenstorrent/tt-metal.git --recurse-submodules
cd tt-metal
./install_dependencies.sh
./build_metal.sh && ./create_venv.sh
source python_env/bin/activate

# Install vLLM plugin
git clone https://github.com/tenstorrent/tt-inference-server.git
cd tt-inference-server/tt-vllm-plugin
pip install -e .
export VLLM_USE_V1=1

# Start server
./serve.sh
```

---

## API Endpoints

| Endpoint | Purpose | Example |
|----------|---------|---------|
| `POST /v1/completions` | Text completion | See below |
| `POST /v1/chat/completions` | Chat interaction | See below |
| `POST /v1/embeddings` | Vector embeddings | See below |

---

## Code Examples

### Example 1: Simple Chat (Python)

```python
import requests

response = requests.post(
    "http://localhost:8000/v1/chat/completions",
    json={
        "model": "meta-llama/Llama-3.2-1B-Instruct",
        "messages": [{"role": "user", "content": "Hello!"}]
    }
)
print(response.json()["choices"][0]["message"]["content"])
```

### Example 2: Using OpenAI SDK

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://localhost:8000/v1",
    api_key="dummy"
)

response = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[{"role": "user", "content": "What is AI?"}]
)
print(response.choices[0].message.content)
```

### Example 3: Streaming Response

```python
from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="dummy")

stream = client.chat.completions.create(
    model="meta-llama/Llama-3.2-1B-Instruct",
    messages=[{"role": "user", "content": "Write a poem"}],
    stream=True
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end='', flush=True)
```

### Example 4: Curl Command

```bash
curl -X POST http://localhost:8000/v1/chat/completions \
  -H "Content-Type: application/json" \
  -d '{
    "model": "meta-llama/Llama-3.2-1B-Instruct",
    "messages": [{"role": "user", "content": "Hello!"}],
    "temperature": 0.7
  }'
```

---

## Supported Models

| Model | Size | Hardware |
|-------|------|----------|
| Llama 3.2 1B | 1B | n150 |
| Llama 3.2 3B | 3B | n150/n300 |
| Llama 3.2 11B Vision | 11B | n300/T3K |
| Llama 3.3 70B | 70B | T3K/Galaxy |
| Mistral 7B | 7B | n300 |
| Qwen 2.5 7B | 7B | n300 |

---

## Hardware Requirements

| Device | VRAM | Use Case |
|--------|------|----------|
| n150 | Lower | Small models (1B-3B) |
| n300 | Medium | Standard models (7B-13B) |
| T3K | High | Large models (70B+) |
| Galaxy | Very High | Ultra-large models |

---

## Troubleshooting

### Device not found
```bash
# Check device
ls -l /dev/tenstorrent

# Check permissions
sudo chmod 666 /dev/tenstorrent
```

### Low performance
```bash
# Set CPU governor
sudo cpupower frequency-set -g performance

# Enable hugepages
echo 2048 | sudo tee /sys/kernel/mm/hugepages/hugepages-2048kB/nr_hugepages
```

### Memory errors
- Use smaller model
- Reduce batch size
- Check available memory with `tt-smi`

---

## Integration with Claude Code

### Method 1: Direct HTTP calls
Configure Claude Code to make HTTP requests to your vLLM-TT-Metal server endpoint.

### Method 2: OpenAI SDK
Use OpenAI Python SDK with custom base_url pointing to your Tenstorrent server.

### Method 3: Microservice Architecture
- Frontend: Claude Code
- Backend: Tenstorrent vLLM server
- Communication: REST API

---

## Key Resources

- **Main Repository**: https://github.com/tenstorrent/tt-metal
- **vLLM Fork**: https://github.com/tenstorrent/vllm
- **Inference Server**: https://github.com/tenstorrent/tt-inference-server
- **Documentation**: https://docs.tenstorrent.com/
- **Developer Portal**: https://tenstorrent.com/en/developers/

---

## Architecture Diagram

```
External Client (Claude Code)
        ↓ HTTP/REST
vLLM Server (OpenAI-compatible API)
        ↓
TT-Transformers (Optimized Models)
        ↓
TT-Metal Runtime
        ↓
Tenstorrent Hardware (n150/n300/T3K/Galaxy)
```

---

## Sample Server Configuration

```python
# run.py example
python3 run.py \
  --model meta-llama/Llama-3.2-1B-Instruct \
  --device n300 \
  --workflow server \
  --port 8000 \
  --host 0.0.0.0
```

---

## Environment Variables

```bash
export VLLM_USE_V1=1                    # Enable v1 plugin architecture
export TT_METAL_LOGGER_LEVEL=INFO      # Set logging level
export PYTHONPATH=/path/to/tt-metal:$PYTHONPATH
```

---

## Testing the Setup

```python
# Simple test script
import requests

def test_connection():
    try:
        response = requests.get("http://localhost:8000/health")
        print("✅ Server is running")
        return True
    except:
        print("❌ Server not responding")
        return False

def test_inference():
    response = requests.post(
        "http://localhost:8000/v1/chat/completions",
        json={
            "model": "meta-llama/Llama-3.2-1B-Instruct",
            "messages": [{"role": "user", "content": "Hi"}],
            "max_tokens": 10
        }
    )
    if response.status_code == 200:
        print("✅ Inference working")
        print("Response:", response.json()["choices"][0]["message"]["content"])
    else:
        print("❌ Inference failed")
        print("Error:", response.text)

if __name__ == "__main__":
    if test_connection():
        test_inference()
```

---

**Last Updated**: February 13, 2026
