import argparse
import asyncio
import sys

import edge_tts


async def generate(text: str, voice: str):
    communicate = edge_tts.Communicate(text=text, voice=voice)

    async for chunk in communicate.stream():
        if chunk["type"] == "audio":
            sys.stdout.buffer.write(chunk["data"])
            sys.stdout.buffer.flush()


def main():
    parser = argparse.ArgumentParser()

    parser.add_argument("--voice", required=True)
    parser.add_argument("--text", required=True)

    args = parser.parse_args()

    asyncio.run(generate(args.text, args.voice))


if __name__ == "__main__":
    main()