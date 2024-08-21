const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DestraNetwork", function () {
  let DestraNetwork;
  let destra;
  let owner;
  let addr1;
  let addr2;
  let addr3;

  beforeEach(async function () {
    DestraNetwork = await ethers.getContractFactory("DestraNetwork");
    [owner, addr1, addr2, addr3] = await ethers.getSigners();

    destra = await DestraNetwork.deploy();
    await destra.waitForDeployment()
    await destra.openTrading();

  });

  describe("Deployment", function () {
    it("Should set the right owner", async function () {
      expect(await destra.owner()).to.equal(owner.address);
    });

    it("Should have the correct total supply", async function () {
      const totalSupply = await destra.totalSupply();
      expect(totalSupply).to.equal(ethers.parseUnits("1000000000", 18));
    });

    it("Owner should have the entire supply initially", async function () {
      const ownerBalance = await destra.balanceOf(owner.address);
      expect(ownerBalance).to.equal(await destra.totalSupply());
    });
  });

  describe("Transactions", function () {
    it("Should transfer tokens between accounts", async function () {
      // Transfer 100 tokens from owner to addr1
      await destra.transfer(addr1.address, ethers.parseUnits("100", 18));
      const addr1Balance = await destra.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseUnits("100", 18));
    });

    it("Should fail if sender doesn’t have enough tokens", async function () {
      const initialOwnerBalance = await destra.balanceOf(owner.address);

      // Try to send 1 token from addr1 (0 tokens) to owner (should fail)
      await expect(
        destra.connect(addr1).transfer(owner.address, ethers.parseUnits("1", 18))
      ).to.be.revertedWith("Insufficient balance");

      // Owner balance shouldn't have changed.
      expect(await destra.balanceOf(owner.address)).to.equal(initialOwnerBalance);
    });

    it("Should update balances after transfers", async function () {
      const initialOwnerBalance = await destra.balanceOf(owner.address);

      // Transfer 100 tokens from owner to addr1.
      await destra.transfer(addr1.address, ethers.parseUnits("100", 18));

      // Transfer 50 tokens from owner to addr2.
      await destra.transfer(addr2.address, ethers.parseUnits("50", 18));

      // Check balances.
      const finalOwnerBalance = await destra.balanceOf(owner.address);
      expect(finalOwnerBalance).to.equal(
        initialOwnerBalance - ethers.parseUnits("150", 18)
      );

      const addr1Balance = await destra.balanceOf(addr1.address);
      expect(addr1Balance).to.equal(ethers.parseUnits("100", 18));

      const addr2Balance = await destra.balanceOf(addr2.address);
      expect(addr2Balance).to.equal(ethers.parseUnits("50", 18));
    });
  });

  describe("Fee and Liquidity Management", function () {
    it("Should correctly set fees and manage exemptions", async function () {
      // Use the getTotalFee function to retrieve initial fees
      const initialBuyFee = await destra.getTotalFee(false); // false indicates buy fee
      const initialSellFee = await destra.getTotalFee(true); // true indicates sell fee
      
      expect(initialBuyFee).to.equal(500);
      expect(initialSellFee).to.equal(6000);
  
      // Update fees
      await destra.setFees(300, 4000, 200, 3000, 10000);
  
      // Check updated fees using the getTotalFee function
      const updatedBuyFee = await destra.getTotalFee(false); // false indicates buy fee
      const updatedSellFee = await destra.getTotalFee(true); // true indicates sell fee
  
      expect(updatedBuyFee).to.equal(500); // 300 + 200
      expect(updatedSellFee).to.equal(7000); // 4000 + 3000
    });
  });
  





  describe("Airdrop Functionality", function () {
    it("Should distribute tokens correctly through airdrop", async function () {
      const addresses = [addr1.address, addr2.address];
      const amounts = [100, 200];

      await destra.airdrop(addresses, amounts);

      expect(await destra.balanceOf(addr1.address)).to.equal(ethers.parseUnits("100", 18));
      expect(await destra.balanceOf(addr2.address)).to.equal(ethers.parseUnits("200", 18));
    });

    it("Should only airdrop to non-liquidity creators", async function () {
      await destra.addLiquidityPool(addr1.address, true);

      const addresses = [addr1.address, addr2.address];
      const amounts = [100, 200];

      await destra.airdrop(addresses, amounts);

      // addr1 should not receive tokens because it's a liquidity creator
      expect(await destra.balanceOf(addr1.address)).to.equal(0);
      expect(await destra.balanceOf(addr2.address)).to.equal(ethers.parseUnits("200", 18));
    });
  });


  describe("Blacklist Management", function () {
    it("Should allow owner to blacklist accounts", async function () {
      await destra.transfer(addr1.address, ethers.parseUnits("100", 18));
      await destra.blacklistWallets([addr1.address], true);
      const isBlacklisted = await destra.blacklist(addr1.address);
      console.log(isBlacklisted)
      expect(isBlacklisted).to.not.equal(0); // Block number is non-zero if blacklisted

      await expect(
        destra.connect(addr1).transfer(addr2.address, ethers.parseUnits("10", 18))
      ).to.be.revertedWith("Wallet blacklisted!");
    });

    it("Should allow owner to remove accounts from blacklist", async function () {
      await destra.transfer(addr1.address, ethers.parseUnits("100", 18));
      await destra.blacklistWallets([addr1.address], true);
      await destra.blacklistWallets([addr1.address], false);
      const isBlacklisted = await destra.blacklist(addr1.address);
      expect(isBlacklisted).to.equal(0); // Zero means not blacklisted

      await expect(
        destra.connect(addr1).transfer(addr2.address, ethers.parseUnits("10", 18))
      ).to.not.be.reverted;
    });
  });

  describe("Ownership", function () {
    it("Should transfer ownership successfully", async function () {
      await destra.transferOwnership(addr1.address);
      const newOwner = await destra.owner();
      expect(newOwner).to.equal(addr1.address);

      // Try to transfer ownership again from the new owner
      await destra.connect(addr1).transferOwnership(addr2.address);
      const updatedOwner = await destra.owner();
      expect(updatedOwner).to.equal(addr2.address);
    });

    it("Should not allow non-owners to transfer ownership", async function () {
      await expect(
        destra.connect(addr1).transferOwnership(addr2.address)
      ).to.be.revertedWith("Ownable: caller is not the owner");
    });
  });
});
