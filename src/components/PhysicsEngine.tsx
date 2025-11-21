import { useFrame } from '@react-three/fiber';
import { useStockStore } from '../stores/stockStore';

const BOUNDS = 40; // Boundary limits

export function PhysicsEngine() {
    const { stocks, setStocks, gravityStrength, timeSpeed, collisionsEnabled } = useStockStore();

    useFrame(() => {
        if (stocks.length === 0) return;

        // Check if we are in "Equilibrium Mode" (Gravity ~ 0.05)
        const isEquilibrium = Math.abs(gravityStrength - 0.05) < 0.005;

        // Update positions based on physics
        const updatedStocks = stocks.map((stock, index) => {
            let { x, y, z, vx, vy, vz } = stock;

            // 1. Apply forces
            if (isEquilibrium) {
                // ORBITAL MODE: Stocks orbit around the center (Value Core)
                // Calculate distance to center
                const dist = Math.sqrt(x * x + y * y + z * z);

                if (dist > 0) {
                    // Apply centripetal force to keep in orbit
                    const force = (gravityStrength * 50) / (dist * dist); // Inverse square law
                    vx -= (x / dist) * force;
                    vy -= (y / dist) * force;
                    vz -= (z / dist) * force;

                    // Nudge velocity towards tangential direction to maintain orbit
                    // Cross product of position and up vector (0,1,0) gives tangent
                    // This creates a disk-like orbit preference, but we can randomize "up" per stock for 3D orbits
                    // For simplicity, let's just dampen radial velocity and boost tangential

                    // Radial component of velocity
                    const vRadial = (vx * x + vy * y + vz * z) / dist;

                    // Dampen radial velocity (prevent flying off or crashing in)
                    vx -= (x / dist) * vRadial * 0.1;
                    vy -= (y / dist) * vRadial * 0.1;
                    vz -= (z / dist) * vRadial * 0.1;
                }
            } else {
                // STANDARD MODE: Attraction toward value core (center)
                // High Rule of 40 stocks create gravity
                const highValueStocks = stocks.filter(s => s.rule_of_40 >= 40);

                if (highValueStocks.length > 0 && stock.rule_of_40 < 60) {
                    // Calculate center of mass for high-value stocks
                    const centerX = highValueStocks.reduce((sum, s) => sum + s.x, 0) / highValueStocks.length;
                    const centerY = highValueStocks.reduce((sum, s) => sum + s.y, 0) / highValueStocks.length;
                    const centerZ = highValueStocks.reduce((sum, s) => sum + s.z, 0) / highValueStocks.length;

                    // Apply attraction force
                    const strength = gravityStrength * (1 - stock.rule_of_40 / 100);
                    vx += (centerX - x) * strength;
                    vy += (centerY - y) * strength;
                    vz += (centerZ - z) * strength;
                }
            }

            // 2. Collision detection (simple sphere-sphere)
            if (collisionsEnabled) {
                for (let j = 0; j < stocks.length; j++) {
                    if (j === index) continue;

                    const other = stocks[j];
                    const dx = other.x - x;
                    const dy = other.y - y;
                    const dz = other.z - z;
                    const distance = Math.sqrt(dx * dx + dy * dy + dz * dz);
                    const minDistance = stock.size + other.size;

                    if (distance < minDistance && distance > 0) {
                        // Elastic collision
                        const nx = dx / distance;
                        const ny = dy / distance;
                        const nz = dz / distance;

                        const relativeVelocity = (vx - other.vx) * nx + (vy - other.vy) * ny + (vz - other.vz) * nz;

                        if (relativeVelocity < 0) {
                            const impulse = relativeVelocity * stock.elasticity;
                            vx -= impulse * nx;
                            vy -= impulse * ny;
                            vz -= impulse * nz;
                        }
                    }
                }
            }

            // 3. Update position
            x += vx * timeSpeed;
            y += vy * timeSpeed;
            z += vz * timeSpeed;

            // 4. Boundary conditions (bounce off walls)
            if (Math.abs(x) > BOUNDS) {
                vx *= -stock.elasticity;
                x = Math.sign(x) * BOUNDS;
            }
            if (Math.abs(y) > BOUNDS) {
                vy *= -stock.elasticity;
                y = Math.sign(y) * BOUNDS;
            }
            if (Math.abs(z) > BOUNDS) {
                vz *= -stock.elasticity;
                z = Math.sign(z) * BOUNDS;
            }

            // 5. Apply damping (less damping in orbital mode)
            const damping = isEquilibrium ? 0.999 : 0.98;
            vx *= damping;
            vy *= damping;
            vz *= damping;

            return {
                ...stock,
                x,
                y,
                z,
                vx,
                vy,
                vz,
            };
        });

        setStocks(updatedStocks);
    });

    return null; // This is a logic-only component
}
