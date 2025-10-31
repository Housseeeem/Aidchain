"use client";

import { useEffect, useRef, useState } from "react";
import { Shield, AlertTriangle, CheckCircle } from "lucide-react";

export function NetworkVisualization() {
  const beforeCanvasRef = useRef<HTMLCanvasElement>(null);
  const afterCanvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode
    const checkDarkMode = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };

    checkDarkMode();
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    const beforeCanvas = beforeCanvasRef.current;
    const afterCanvas = afterCanvasRef.current;
    const container = containerRef.current;
    if (!beforeCanvas || !afterCanvas || !container) return;

    const beforeCtx = beforeCanvas.getContext("2d");
    const afterCtx = afterCanvas.getContext("2d");
    if (!beforeCtx || !afterCtx) return;

    let animationId: number;

    // Set canvas size to fill half container
    const resizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const halfWidth = rect.width / 2;

      [beforeCanvas, afterCanvas].forEach((canvas, index) => {
        canvas.width = halfWidth * window.devicePixelRatio;
        canvas.height = rect.height * window.devicePixelRatio;
        const ctx = index === 0 ? beforeCtx : afterCtx;
        ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        canvas.style.width = halfWidth + "px";
        canvas.style.height = rect.height + "px";
      });
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // Node positioning for both sides
    const getNodes = (isAfter: boolean = false) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width / 2;
      const height = rect.height;
      const padding = 40;

      const baseNodes = [
        {
          x: width * 0.2,
          y: height * 0.2,
          size: 10,
          label: "Enterprise A",
          type: "provider",
          pulse: 0,
          trust: 0.6,
        },
        {
          x: width * 0.8,
          y: height * 0.25,
          size: 9,
          label: "Organization B",
          type: "researcher",
          pulse: 0,
          trust: 0.5,
        },
        {
          x: width * 0.15,
          y: height * 0.6,
          size: 11,
          label: "Company C",
          type: "provider",
          pulse: 0,
          trust: 0.7,
        },
        {
          x: width * 0.75,
          y: height * 0.7,
          size: 8,
          label: "Institution D",
          type: "researcher",
          pulse: 0,
          trust: 0.4,
        },
        {
          x: width * 0.5,
          y: height * 0.45,
          size: isAfter ? 14 : 12,
          label: isAfter ? "Hedera Network" : "Central Hub",
          type: "hub",
          pulse: 0,
          trust: isAfter ? 1.0 : 0.8,
        },
        {
          x: width * 0.3,
          y: height * 0.8,
          size: 7,
          label: "Partner E",
          type: "researcher",
          pulse: 0,
          trust: 0.6,
        },
      ];

      return baseNodes.map((node) => ({
        ...node,
        trust: isAfter ? Math.min(1.0, node.trust + 0.3) : node.trust,
      }));
    };

    // Different connection patterns for before/after
    const beforeConnections = [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
      [0, 5],
      [1, 5],
      [2, 4],
      [3, 5], // Chaotic mesh
    ];

    const afterConnections = [
      [4, 0],
      [4, 1],
      [4, 2],
      [4, 3],
      [4, 5], // Hub-centric with Hedera
    ];

    const beforePackets: Array<{
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      size: number;
      opacity: number;
      isCorrupted: boolean;
    }> = [];

    const afterPackets: Array<{
      fromIndex: number;
      toIndex: number;
      progress: number;
      speed: number;
      size: number;
      opacity: number;
      isVerified: boolean;
    }> = [];

    // Generate packets for before (chaotic, some corrupted)
    const generateBeforePacket = () => {
      if (Math.random() < 0.2) {
        const connectionIndex = Math.floor(
          Math.random() * beforeConnections.length
        );
        const [from, to] = beforeConnections[connectionIndex];

        beforePackets.push({
          fromIndex: from,
          toIndex: to,
          progress: 0,
          speed: 0.005 + Math.random() * 0.015,
          size: 2 + Math.random() * 2,
          opacity: 0.6 + Math.random() * 0.4,
          isCorrupted: Math.random() < 0.3, // 30% corruption rate
        });
      }
    };

    // Generate packets for after (organized, verified)
    const generateAfterPacket = () => {
      if (Math.random() < 0.25) {
        const connectionIndex = Math.floor(
          Math.random() * afterConnections.length
        );
        const [from, to] = afterConnections[connectionIndex];

        afterPackets.push({
          fromIndex: from,
          toIndex: to,
          progress: 0,
          speed: 0.008 + Math.random() * 0.008,
          size: 2.5 + Math.random() * 1.5,
          opacity: 0.8 + Math.random() * 0.2,
          isVerified: true,
        });
      }
    };

    const drawNetwork = (ctx: CanvasRenderingContext2D, isAfter: boolean) => {
      const rect = container.getBoundingClientRect();
      const width = rect.width / 2;
      const height = rect.height;

      ctx.clearRect(0, 0, width, height);

      const nodes = getNodes(isAfter);
      const connections = isAfter ? afterConnections : beforeConnections;
      const packets = isAfter ? afterPackets : beforePackets;

      // Theme colors
      const colors = {
        background: isDark ? "#0a0a0a" : "#ffffff",
        connection: isDark ? "#374151" : "#e5e7eb",
        connectionActive: isDark ? "#6b7280" : "#9ca3af",
        connectionSecure: isDark ? "#10b981" : "#059669",
        connectionInsecure: isDark ? "#ef4444" : "#dc2626",
        provider: isDark ? "#ffffff" : "#1f2937",
        researcher: isDark ? "#d1d5db" : "#4b5563",
        hub: isAfter
          ? isDark
            ? "#10b981"
            : "#059669"
          : isDark
          ? "#f9fafb"
          : "#111827",
        text: isDark ? "#f9fafb" : "#1f2937",
        dataFlow: isDark ? "#ffffff" : "#000000",
        dataFlowSecure: isDark ? "#10b981" : "#059669",
        dataFlowCorrupted: isDark ? "#ef4444" : "#dc2626",
        nodeBorder: isDark ? "#374151" : "#ffffff",
      };

      // Draw background grid
      ctx.strokeStyle = isDark ? "#1f2937" : "#f3f4f6";
      ctx.lineWidth = 0.3;
      const gridSize = 30;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw connections
      connections.forEach(([from, to]) => {
        const fromNode = nodes[from];
        const toNode = nodes[to];

        const hasActiveFlow = packets.some(
          (packet) =>
            (packet.fromIndex === from && packet.toIndex === to) ||
            (packet.fromIndex === to && packet.toIndex === from)
        );

        if (isAfter) {
          ctx.strokeStyle = hasActiveFlow
            ? colors.connectionSecure
            : colors.connection;
          ctx.lineWidth = hasActiveFlow ? 3 : 1.5;
        } else {
          const trustLevel = (fromNode.trust + toNode.trust) / 2;
          ctx.strokeStyle = hasActiveFlow
            ? trustLevel > 0.6
              ? colors.connectionActive
              : colors.connectionInsecure
            : colors.connection;
          ctx.lineWidth = hasActiveFlow ? 2 : 1;
        }

        ctx.globalAlpha = hasActiveFlow ? 0.9 : 0.4;

        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();

        // Draw security indicators for after
        if (isAfter && hasActiveFlow) {
          const midX = (fromNode.x + toNode.x) / 2;
          const midY = (fromNode.y + toNode.y) / 2;

          ctx.globalAlpha = 0.8;
          ctx.fillStyle = colors.connectionSecure;
          ctx.beginPath();
          ctx.arc(midX, midY, 3, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      ctx.globalAlpha = 1;

      // Generate and animate packets
      if (isAfter) {
        generateAfterPacket();
      } else {
        generateBeforePacket();
      }

      // Update and draw packets
      for (let i = packets.length - 1; i >= 0; i--) {
        const packet = packets[i];
        const fromNode = nodes[packet.fromIndex];
        const toNode = nodes[packet.toIndex];

        packet.progress += packet.speed;

        if (packet.progress >= 1) {
          nodes[packet.toIndex].pulse = 1;
          packets.splice(i, 1);
          continue;
        }

        const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress;
        const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress;

        ctx.globalAlpha = packet.opacity;

        if (isAfter) {
          ctx.fillStyle = colors.dataFlowSecure;
        } else {
          ctx.fillStyle = (packet as any).isCorrupted
            ? colors.dataFlowCorrupted
            : colors.dataFlow;
        }

        // Main packet
        ctx.beginPath();
        ctx.arc(x, y, packet.size, 0, Math.PI * 2);
        ctx.fill();

        // Special effects
        if (isAfter) {
          // Verified checkmark trail
          ctx.strokeStyle = colors.dataFlowSecure;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(x, y, packet.size + 2, 0, Math.PI * 2);
          ctx.stroke();
        } else if ((packet as unknown).isCorrupted) {
          // Corruption indicator
          ctx.strokeStyle = colors.dataFlowCorrupted;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(x - 3, y - 3);
          ctx.lineTo(x + 3, y + 3);
          ctx.moveTo(x + 3, y - 3);
          ctx.lineTo(x - 3, y + 3);
          ctx.stroke();
        }
      }

      ctx.globalAlpha = 1;

      // Draw nodes
      nodes.forEach((node) => {
        if (node.pulse > 0) {
          node.pulse -= 0.05;
        }

        const pulseSize =
          node.pulse > 0 ? node.size + node.pulse * 6 : node.size;

        // Draw trust indicator ring
        if (!isAfter) {
          const trustColor =
            node.trust > 0.7
              ? colors.connectionSecure
              : node.trust > 0.5
              ? colors.connectionActive
              : colors.connectionInsecure;
          ctx.strokeStyle = trustColor;
          ctx.lineWidth = 2;
          ctx.globalAlpha = 0.6;
          ctx.beginPath();
          ctx.arc(node.x, node.y, node.size + 4, 0, Math.PI * 2 * node.trust);
          ctx.stroke();
          ctx.globalAlpha = 1;
        }

        // Draw pulse ring
        if (node.pulse > 0) {
          ctx.globalAlpha = node.pulse * 0.4;
          ctx.strokeStyle = colors[node.type as keyof typeof colors];
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2);
          ctx.stroke();
        }

        ctx.globalAlpha = 1;

        // Draw node
        ctx.fillStyle = colors[node.type as keyof typeof colors];
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = colors.nodeBorder;
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        ctx.fillStyle = colors.text;
        ctx.font = `${Math.max(
          8,
          node.size - 2
        )}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";

        const textMetrics = ctx.measureText(node.label);
        const textWidth = textMetrics.width;
        const textHeight = 14;
        const textX = node.x - textWidth / 2;
        const textY = node.y + node.size + 6;

        ctx.globalAlpha = 0.9;
        ctx.fillStyle = isDark ? "#000000" : "#ffffff";
        ctx.fillRect(textX - 3, textY - 1, textWidth + 6, textHeight + 2);

        ctx.globalAlpha = 1;
        ctx.fillStyle = colors.text;
        ctx.fillText(node.label, node.x, textY);
      });
    };

    const animate = () => {
      drawNetwork(beforeCtx, false);
      drawNetwork(afterCtx, true);
      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationId);
      observer.disconnect();
    };
  }, [isDark]);

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Transforming Data Security & Trust
          </h2>
          <p className="text-xl text-muted-foreground">
            See how Hedera blockchain technology revolutionizes data integrity and trust across any industry
          </p>
        </div>

        <div
          ref={containerRef}
          className="relative bg-background border border-border overflow-hidden flex"
          style={{ height: "500px" }}
        >
          {/* Before Section */}
          <div className="relative w-1/2 border-r border-border">
            <canvas ref={beforeCanvasRef} className="absolute inset-0" />
            <div className="absolute top-4 left-4 bg-background/90 backdrop-blur-sm p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="font-semibold text-sm">
                  Before: Traditional Networks
                </span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Arbitrary connections</li>
                <li>• Data corruption risk</li>
                <li>• Limited trust verification</li>
                <li>• Inconsistent security</li>
              </ul>
            </div>
          </div>

          {/* After Section */}
          <div className="relative w-1/2">
            <canvas ref={afterCanvasRef} className="absolute inset-0" />
            <div className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm p-3 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="font-semibold text-sm">
                  After: Hedera Network
                </span>
              </div>
              <ul className="text-xs text-muted-foreground space-y-1">
                <li>• Centralized verification</li>
                <li>• Guaranteed data integrity</li>
                <li>• Cryptographic trust</li>
                <li>• Immutable transactions</li>
              </ul>
            </div>
          </div>

          {/* Legend */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex flex-wrap gap-4 text-sm bg-background/90 backdrop-blur-sm p-3 border border-border">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-foreground border border-border"></div>
              <span>Data Providers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-muted-foreground border border-border"></div>
              <span>Data Consumers</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 border border-border"></div>
              <span>Hedera Network Hub</span>
            </div>
          </div>

          {/* Hedera Badge */}
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-background/90 backdrop-blur-sm p-2 border border-border flex items-center gap-2">
            <Shield className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium">Powered by Hedera</span>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-background border border-border">
            <Shield className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold mb-2">Universal Security</h3>
            <p className="text-sm text-muted-foreground">
              Cryptographic verification ensures data integrity across any industry or data type
            </p>
          </div>
          <div className="text-center p-4 bg-background border border-border">
            <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
            <h3 className="font-semibold mb-2">Immutable Records</h3>
            <p className="text-sm text-muted-foreground">
              Blockchain technology prevents data tampering and ensures complete audit trails
            </p>
          </div>
          <div className="text-center p-4 bg-background border border-border">
            <AlertTriangle className="h-8 w-8 mx-auto mb-2 text-blue-500" />
            <h3 className="font-semibold mb-2">Trusted Ecosystem</h3>
            <p className="text-sm text-muted-foreground">
              Consensus-based validation creates trust between any data sharing participants
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
