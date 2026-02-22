---
title: "Writing an Operating System Kernel: Booting and Memory Management"
description: "Building a minimal kernel from scratch - bootstrapping, memory management, and understanding how operating systems really work"
date: "2025-02-15"
author: "ArkoiSystems"
tags: ["kernel", "os-dev", "systems", "memory"]
published: true
---

# Introduction

Operating systems are the most fundamental software on any computer. They manage hardware, provide abstractions for applications, and orchestrate everything from memory to file systems. But how does an OS actually work? The best way to understand is to build one.

This post covers the beginning of the ArkoiSystems kernel project - a minimal operating system kernel built from scratch.

## What is a Kernel?

The kernel is the core of an operating system. It runs with full hardware privileges and provides:

- **Process Management** - Creating and scheduling programs
- **Memory Management** - Allocating and protecting memory
- **Hardware Abstraction** - Device drivers and interrupts
- **System Calls** - Interface between user programs and kernel

## Starting from Nothing: The Boot Process

When a computer starts, there's no operating system yet. We need a bootloader to get our kernel running.

### BIOS and UEFI

Modern computers use either BIOS or UEFI firmware. Both follow a similar flow:

```
Power On
  ↓
Firmware (BIOS/UEFI)
  ↓
Bootloader (GRUB/our custom loader)
  ↓
Kernel
```

### The First Instruction

Our kernel starts with a tiny assembly stub - the first code that runs:

```nasm
; boot.asm - Kernel entry point
[BITS 32]
section .multiboot
    ; Multiboot header
    MULTIBOOT_MAGIC equ 0x1BADB002
    MULTIBOOT_FLAGS equ 0x00
    MULTIBOOT_CHECKSUM equ -(MULTIBOOT_MAGIC + MULTIBOOT_FLAGS)

    dd MULTIBOOT_MAGIC
    dd MULTIBOOT_FLAGS
    dd MULTIBOOT_CHECKSUM

section .text
global _start
_start:
    ; Set up stack
    mov esp, stack_top

    ; Call kernel main
    extern kernel_main
    call kernel_main

    ; Hang if kernel returns
    cli
    hlt

section .bss
stack_bottom:
    resb 16384  ; 16 KB stack
stack_top:
```

### Hello, Kernel!

The simplest kernel just writes to the VGA text buffer:

```c
// kernel.c
void kernel_main(void) {
    // VGA text buffer at 0xB8000
    char* video = (char*)0xB8000;
    const char* message = "Hello from ArkoiSystems Kernel!";

    for (int i = 0; message[i] != '\0'; i++) {
        video[i * 2] = message[i];      // Character
        video[i * 2 + 1] = 0x0F;        // White on black
    }

    // Hang forever
    while(1);
}
```

Running this gives us text on the screen - the first sign of life from our kernel!

## Memory Management

Memory is one of the kernel's most critical responsibilities. We need to:

1. **Track available memory** - Know what RAM exists
2. **Allocate pages** - Give memory to processes
3. **Protect memory** - Keep processes from interfering with each other

### Physical Memory Manager

We start with a simple bitmap allocator:

```c
// Each bit represents one 4KB page
uint32_t memory_map[32768];  // 128MB of RAM = 32K pages

void pmm_init(uint32_t mem_size) {
    // Mark all memory as used initially
    memset(memory_map, 0xFF, sizeof(memory_map));

    // Mark available pages as free
    uint32_t num_pages = mem_size / PAGE_SIZE;
    for (uint32_t i = 0; i < num_pages; i++) {
        pmm_free_page(i * PAGE_SIZE);
    }
}

void* pmm_alloc_page(void) {
    // Find first free page
    for (uint32_t i = 0; i < 32768; i++) {
        if (memory_map[i] != 0xFFFFFFFF) {
            // Found freepage
            for (int bit = 0; bit < 32; bit++) {
                if (!(memory_map[i] & (1 << bit))) {
                    memory_map[i] |= (1 << bit);
                    return (void*)((i * 32 + bit) * PAGE_SIZE);
                }
            }
        }
    }
    return NULL;  // Out of memory!
}
```

### Virtual Memory and Paging

Modern CPUs use virtual memory - each process gets its own address space. The Memory Management Unit (MMU) translates virtual addresses to physical addresses using page tables.

```c
typedef struct {
    uint32_t present    : 1;  // Page present in memory
    uint32_t rw         : 1;  // Read/write permission
    uint32_t user       : 1;  // User/supervisor mode
    uint32_t accessed   : 1;  // Has been accessed
    uint32_t dirty      : 1;  // Has been written to
    uint32_t unused     : 7;  // Reserved
    uint32_t frame      : 20; // Physical page frame number
} page_table_entry_t;
```

## Interrupt Handling

Hardware needs to notify the kernel about events: keyboard input, timer ticks, disk I/O completion. This is done through interrupts.

### Interrupt Descriptor Table (IDT)

The CPU uses an IDT to find interrupt handlers:

```c
typedef struct {
    uint16_t base_low;
    uint16_t selector;
    uint8_t  zero;
    uint8_t  flags;
    uint16_t base_high;
} __attribute__((packed)) idt_entry_t;

idt_entry_t idt[256];  // 256 possible interrupts

void idt_set_gate(uint8_t num, uint32_t base, uint16_t selector, uint8_t flags) {
    idt[num].base_low = base & 0xFFFF;
    idt[num].base_high = (base >> 16) & 0xFFFF;
    idt[num].selector = selector;
    idt[num].zero = 0;
    idt[num].flags = flags;
}
```

### Handling a Timer Interrupt

The Programmable Interval Timer (PIT) generates regular interrupts:

```c
void timer_handler(registers_t* regs) {
    static uint32_t tick = 0;
    tick++;

    if (tick % 100 == 0) {
        // Print every second (assuming 100Hz timer)
        printk("Tick: %d\n", tick / 100);
    }
}
```

## System Calls

User programs need to request kernel services through system calls. On x86, this uses the `int 0x80` instruction:

```c
// In kernel
void syscall_handler(registers_t* regs) {
    // System call number in EAX
    uint32_t syscall_num = regs->eax;

    switch (syscall_num) {
        case SYS_WRITE:
            sys_write(regs->ebx, (char*)regs->ecx, regs->edx);
            break;
        case SYS_EXIT:
            sys_exit(regs->ebx);
            break;
    }
}
```

## Debugging Kernel Code

Kernel debugging is challenging - you can't use normal debugging tools. Techniques include:

- **Serial port logging** - Output debug info to COM1
- **QEMU with GDB** - Step through kernel code
- **Bochs debugger** - Inspect CPU state and memory
- **Print statements** - The classic approach still works

```c
void debug_log(const char* msg) {
    // Write to serial port COM1 (0x3F8)
    while (*msg) {
        while (!(inb(0x3FD) & 0x20));  // Wait for ready
        outb(0x3F8, *msg++);
    }
}
```

## Next Steps

Building a complete OS is a huge undertaking. Future posts will cover:

- **Process Scheduling** - Running multiple programs
- **File Systems** - Storing and retrieving data
- **Device Drivers** - Talking to hardware
- **User Space** - Running applications

## Resources

Essential resources for OS development:

- **OSDev Wiki** - Comprehensive OS development reference
- **Intel Software Developer Manuals** - CPU architecture details
- **xv6** - Educational Unix-like OS from MIT
- **Linux Kernel** - Study a real-world implementation

## Conclusion

Writing a kernel strips away all the abstractions we take for granted. You deal directly with hardware, manage every byte of memory, and handle every interrupt. It's challenging but incredibly rewarding.

The ArkoiSystems kernel is just beginning, but already it can boot, manage memory, and handle interrupts. That's a solid foundation for building something real.

---

_The ArkoiSystems kernel is open source and designed for learning. Follow along as we build it piece by piece._
