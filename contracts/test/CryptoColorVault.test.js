const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CryptoColorVault", function () {
  let vault, owner, addr1, addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    const CryptoColorVault = await ethers.getContractFactory("CryptoColorVault");
    vault = await CryptoColorVault.deploy();
    await vault.waitForDeployment();
  });

  describe("claimColor", function () {
    it("should claim a color with correct fee", async function () {
      const tx = await vault.connect(addr1).claimColor("#FF5733", {
        value: ethers.parseEther("0.001"),
      });

      await expect(tx)
        .to.emit(vault, "ColorClaimed")
        .withArgs(addr1.address, "#FF5733", ethers.parseEther("0.001"));

      expect(await vault.getColorOwner("#FF5733")).to.equal(addr1.address);
      expect(await vault.connect(addr1).getMyColor()).to.equal("#FF5733");
      expect(await vault.getAllColors()).to.deep.equal(["#FF5733"]);
    });

    it("should revert on duplicate color claim", async function () {
      await vault.connect(addr1).claimColor("#FF5733", {
        value: ethers.parseEther("0.001"),
      });

      await expect(
        vault.connect(addr2).claimColor("#FF5733", {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.revertedWith("Color already claimed");
    });

    it("should revert with wrong fee (too low)", async function () {
      await expect(
        vault.connect(addr1).claimColor("#FF5733", {
          value: ethers.parseEther("0.0005"),
        })
      ).to.be.revertedWith("Incorrect fee amount");
    });

    it("should revert with wrong fee (too high)", async function () {
      await expect(
        vault.connect(addr1).claimColor("#FF5733", {
          value: ethers.parseEther("0.002"),
        })
      ).to.be.revertedWith("Incorrect fee amount");
    });

    it("should revert when address already owns a color", async function () {
      await vault.connect(addr1).claimColor("#FF5733", {
        value: ethers.parseEther("0.001"),
      });

      await expect(
        vault.connect(addr1).claimColor("#00FF00", {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.revertedWith("Already own a color");
    });

    it("should revert with invalid hex format", async function () {
      await expect(
        vault.connect(addr1).claimColor("#ZZZZZZ", {
          value: ethers.parseEther("0.001"),
        })
      ).to.be.reverted;
    });
  });

  describe("getAllColorsWithOwners", function () {
    it("should return parallel arrays correctly", async function () {
      await vault.connect(addr1).claimColor("#FF5733", {
        value: ethers.parseEther("0.001"),
      });
      await vault.connect(addr2).claimColor("#00FF00", {
        value: ethers.parseEther("0.001"),
      });

      const [colors, owners] = await vault.getAllColorsWithOwners();
      expect(colors).to.deep.equal(["#FF5733", "#00FF00"]);
      expect(owners).to.deep.equal([addr1.address, addr2.address]);
    });
  });

  describe("withdrawFees", function () {
    it("should allow owner to withdraw", async function () {
      await vault.connect(addr1).claimColor("#FF5733", {
        value: ethers.parseEther("0.001"),
      });

      const balanceBefore = await ethers.provider.getBalance(owner.address);
      const tx = await vault.connect(owner).withdrawFees();
      const receipt = await tx.wait();
      const gasCost = receipt.gasUsed * receipt.gasPrice;
      const balanceAfter = await ethers.provider.getBalance(owner.address);

      expect(balanceAfter - balanceBefore + gasCost).to.equal(
        ethers.parseEther("0.001")
      );
    });

    it("should revert when non-owner tries to withdraw", async function () {
      await expect(
        vault.connect(addr1).withdrawFees()
      ).to.be.revertedWithCustomError(vault, "OwnableUnauthorizedAccount");
    });
  });

  describe("updateFee", function () {
    it("should allow owner to update fee", async function () {
      await vault.connect(owner).updateFee(ethers.parseEther("0.002"));
      expect(await vault.claimFee()).to.equal(ethers.parseEther("0.002"));

      await expect(
        vault.connect(addr1).claimColor("#FF5733", {
          value: ethers.parseEther("0.002"),
        })
      ).to.emit(vault, "ColorClaimed");
    });
  });
});
